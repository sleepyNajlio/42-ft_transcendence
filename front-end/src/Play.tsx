import { useEffect, useRef } from 'react';
import Navbar from './Components/Navbar.tsx';
import Sbox from './Components/Sbox.tsx';
import {io, Socket} from "socket.io-client";
import  './styles/css/main.css'
import { useState } from 'react';
import { SVG, on, Circle, Text } from '@svgdotjs/svg.js';
import { useDocumentVisible } from './useDocumentVisible'; // adjust the path according to your project structure
import { Player, Players, Ball } from './Components/types';

  let pHost: Player;
  let pGuest: Player;
  let end : Text

  let playerLeft : number = 0
  let playerRight : number = 0

  const game = (socket: Socket, players: Players = {}, ball: Ball) => {
    // define board size and create a svg board

    const width = 600,
      height = 600;
    const draw = SVG().addTo('#pong').size(width, height).attr({ fill: '#f06' });
    // draw the board
    var board_gradient = draw.gradient('linear', function(add) {
      add.stop(0, '#000046')
      add.stop(1, '#1CB5E0')
    })
    var guest_gradient = draw.gradient('linear', function(add) {
      add.stop(0, '#A1FFCE')
      add.stop(1, '#FAFFD1')
    })
    var host_gradient = draw.gradient('linear', function(add) {
      add.stop(0, '#606c88')
      add.stop(1, '#3f4c6b')
    })
    draw.rect(width, height).fill(board_gradient);
    const paddleWidth = 20,
      paddleHeight = 100;
    pHost = Object.values(players).find(player => player.host === true)!;
    pGuest = Object.values(players).find(player => player.host === false)!;
    pHost.paddle = draw.rect(paddleWidth, paddleHeight).radius(12).x(0).cy(height / 2).fill(host_gradient);
    pGuest.paddle = draw.rect(paddleWidth, paddleHeight).radius(12).x(width - paddleWidth).cy(height / 2).fill(guest_gradient);

    const ballSize = 20;
    ball.cercle = draw.circle(ballSize).center(width / 2, height / 2).fill('#ff69b4');

    ball.vx = 0;
    ball.vy = 0;
    ball.cx = ball.cercle.cx();
    ball.cy = ball.cercle.cy();
    
    {
      var scoreLeft : Text
      scoreLeft = draw.text("0").font({
      size: 32,
      family: 'Menlo, sans-serif',
      anchor: 'end',
      fill: '#fff'
      }).move(width/2-10, 10) 
      var scoreRight = scoreLeft.clone().x(width/2+20).addTo(draw);
    }
    var click = draw.text('Click to start').font({
      size: 32,
      family: 'Menlo, sans-serif',
      anchor: 'end',
      fill: '#fff'
      }).center(width/2, height/2);

      var rectWidth = click.length() + 20;
      var rectHeight = 100;

      var rect = draw.rect(rectWidth, rectHeight).radius(10).center(width/2, height/2).fill('#000').opacity(0.5);
      click.front();
      
    rect.click(function() {
      console.log("start clicked", ball);
      
      if (ball.vx === 0 && ball.vy === 0) {
        let tvx = Math.random() * 500 - 250
        let tvy = Math.random() * 500 - 250
        while (Math.abs(tvx) < 100) {
          tvx = Math.random() * 500 - 250
        }
        while (Math.abs(tvy) < 100) {
          tvy = Math.random() * 500 - 250
        }
        socket.emit('moveBall', { ball: {vx: tvx, vy: tvy, cx: ball.cx, cy: ball.cy}, action: "start" });
      }
    })
    let chck = false;
    socket.on('opponentDisconnected', () => {
      console.log("3");
      if (end) {
        end.remove();
      }
      reset(playerRight, playerLeft);
      rect.show();
      click.show();
    });

    socket.on('move', (data: {ball: Ball, paddleDirection: number, id: string }) => {
      chck = true;
      if (pGuest && data.id == pGuest.s_id)
        pGuest.paddleDirection = data.paddleDirection;
      if (pHost && data.id == pHost.s_id)
        pHost.paddleDirection = data.paddleDirection;
        ball = {
          ...ball,
          ...data.ball,
        }
    });

    let isKeyDown = false;
    socket.on('getFrame', (data) => {
      if (pGuest && pGuest.paddle && data.id == pHost.s_id)
        socket.emit('paddlePos', { y: pGuest.paddle.cy(), playerLeft, playerRight, ball: {cx: ball.cx, cy: ball.cy, vx: ball.vx, vy: ball.vy}});
      if (pHost && pHost.paddle && data.id == pGuest.s_id)
        socket.emit('paddlePos', { y: pHost.paddle.cy(), playerLeft, playerRight, ball: {cx: ball.cx, cy: ball.cy, vx: ball.vx, vy: ball.vy}});
    });
    
    socket.on('updateFrame', (data: {ball: {cx : number, cy: number, vx: number, vy: number}, y: number, playerLeft: number, playerRight: number, id: string }) => {
      if (pHost && pHost.paddle && data.id == pHost.s_id)
        pHost.paddle.cy(data.y);
      if (pGuest && pGuest.paddle && data.id == pGuest.s_id)
        pGuest.paddle.cy(data.y);
      ball = {
        ...ball,
        ...data.ball,
      }
      ball.cercle.animate(20).center(ball.cx, ball.cy)
      playerLeft = data.playerLeft;
      playerRight = data.playerRight;
    });
    

    on(document, 'keydown', function (e: any) {
      const { cercle, ...ballWithoutCercle } = ball;
      if (!chck) {
        if (e.keyCode == 40 || e.keyCode == 38) {
          e.preventDefault();
          if (!isKeyDown) {
            isKeyDown = true;
            socket.emit('keydown', { ball: ballWithoutCercle, paddleDirection: e.keyCode == 40 ? 1 : e.keyCode == 38 ? -1 : 0, id: socket.id });
          }
        }
      }
    });

    on(document, 'keyup', function (e: any) {
      const { cercle, ...ballWithoutCercle } = ball;
      if (!chck) {
        if (e.keyCode == 40 || e.keyCode == 38) {
          e.preventDefault();
          isKeyDown = false;
          socket.emit('keyup', { ball: ballWithoutCercle, paddleDirection: 0, id: socket.id });
        }
      }
    });

    socket.on('start', (data: {ball: Ball }) => {
      ball = {
        ...ball,
        ...data.ball,
      }
      rect.hide();
      click.hide();
    });

    socket.on('reset', (data: {ball: Ball, playerRight: number, playerLeft: number }) => {
      if (pHost && pHost.paddle) {
        pHost.paddle.animate(20).cy(height / 2)
      }
      if (pGuest && pGuest.paddle) {
        pGuest.paddle.animate(20).cy(height / 2)
      }
      ball = {
        ...ball,
        ...data.ball,
      }
      ball.cercle.animate(20).center(ball.cx, ball.cy)
      playerLeft = data.playerLeft;
      playerRight = data.playerRight;
      scoreLeft.text(playerRight.toString())
      scoreRight.text(playerLeft.toString())
      rect.show();
      click.show();
    });

    socket.on('ballVel', (data:{reset: Boolean, ball: Ball}) => {
      ball = {
        ...ball,
        ...data.ball,
      }
      ball.cercle.animate(20).center(ball.cx, ball.cy)
    });
    function update(dt: number) {
      // console.log(`vball.cx: ${ball.cx}, vball.cy: ${ball.cy}`)
      if (ball.vx != 0 && ball.vy != 0)
        ball.cercle.dmove(ball.vx*dt, ball.vy*dt)
      ball.cx = ball.cercle.cx()
      , ball.cy = ball.cercle.cy()
      if ((ball.vy < 0 && ball.cy <= 0) || (ball.vy > 0 && ball.cy >= height)) {
        socket.emit('moveBall', { ball: { vx: ball.vx, vy: -ball.vy, cx: ball.cx, cy: ball.cy}, action: "up" });
      } else {
        var paddleRightY: number = 0;
        if (pGuest && pGuest.paddle) {
          paddleRightY = parseInt(pGuest.paddle.y().valueOf().toString());
        }
        var paddleLeftY: number = 0;
        if (pHost && pHost.paddle) {
          paddleLeftY = parseInt(pHost.paddle.y().valueOf().toString());
        }
        if ((ball.vx < 0 && ball.cx <= paddleWidth && ball.cy > paddleLeftY && ball.cy < paddleLeftY + paddleHeight) ||
        (ball.vx > 0 && ball.cx >= width - paddleWidth && ball.cy > paddleRightY && ball.cy < paddleRightY + paddleHeight)) {
          socket.emit('moveBall', { ball: { vx: -ball.vx * 1.05, vy: (ball.cy - ((ball.vx < 0 ? paddleLeftY : paddleRightY) + paddleHeight/2)) * 7 , cx: ball.cx, cy: ball.cy}, action: "left -right"});
        }
        else if ((ball.vx < 0 && ball.cx <= 0) || (ball.vx > 0 && ball.cx >= width)) {
          if (ball.vx < 0) { reset(playerRight+1, playerLeft) }
          else { reset(playerRight, playerLeft+1) }
        }
      }
      if (playerRight === 10 || playerLeft === 10) {
          reset(playerRight, playerLeft)
          end = draw.text('Game over').font({
          size: 32,
          family: 'Menlo, sans-serif',
          anchor: 'end',
          fill: '#fff'
          }).center(width/2, height/2)
      }
      if (pGuest && pGuest.paddle && pGuest.paddleSpeed) {
        var playerPaddleY = pGuest.paddle.y();
        if (typeof playerPaddleY === 'number') {
            if (playerPaddleY <= 0 && pGuest.paddleDirection === -1) {
                pGuest.paddle.cy(paddleHeight / 2)
            } else if (playerPaddleY >= height - paddleHeight && pGuest.paddleDirection === 1) {
                pGuest.paddle.y(height - paddleHeight)
            } else {
                pGuest.paddle.dy(pGuest.paddleDirection * pGuest.paddleSpeed)
            }
        }
      }
      if (pHost && pHost.paddle && pHost.paddleSpeed) {
        var playerPaddleY = pHost.paddle.y();
        if (typeof playerPaddleY === 'number') {
            if (playerPaddleY <= 0 && pHost.paddleDirection === -1) {
                pHost.paddle.cy(paddleHeight / 2)
            } else if (playerPaddleY >= height - paddleHeight && pHost.paddleDirection === 1) {
                pHost.paddle.y(height - paddleHeight)
            } else {
                pHost.paddle.dy(pHost.paddleDirection * pHost.paddleSpeed)
            }
          }
        }
        chck = false;
    }

    var lastTime: number | undefined, animFrame: number;
    function callback(ms: number) {
        if (lastTime) {
          const deltaTime = Math.max(0, Math.min(0.1, (ms - lastTime) / 1000));
          update(deltaTime)
        }
        lastTime = ms
        animFrame = requestAnimationFrame(callback)
    }
    callback(100)
    function reset(playerRight: number = 0, playerLeft: number = 0) {
      console.log("3lach reset");
      socket.emit('moveBall', { ball: { vx: 0, vy: 0, cx: width / 2, cy: height / 2 , reset: true}, action: "reset", playerLeft, playerRight });
      rect.show();
      click.show();
    }
    const cleanup = () => {
      draw.clear();
      draw.remove();
    };

    return cleanup;
  };


export function Play() {
    const isDocumentVisible = useDocumentVisible();
    const [showSbox, setShowSbox] = useState(true);
    const [showGame, setshowGame] = useState(false);    
    const [isLoading, setIsLoading] = useState(false); // Add a new state variable for loading
    const [socket, setSocket] = useState<Socket | null>(null);
    const [players, setPlayers] = useState<Players>({});
    const bballRef = useRef<Ball>({
      cercle: new Circle(),
      vx: 0,
      vy: 0,
      cx: 0,
      cy: 0,
    });
    const handleFriendClick = async (player_id: any) => {
        const socket = io("http://localhost:3000/events", {
            transports: ['websocket'],
        });
        socket.emit('invite', 
        {
          player_id: player_id,
        });
        setSocket(socket);
        setIsLoading(true);
    };
    const handleMatchClick = async () => {
      const socket = io("http://localhost:3000/events", {
        transports: ['websocket'],
      });
      setSocket(socket);
      setIsLoading(true); // Set loading to true
    };

    useEffect(() => {
      let isCancelled = false;
      if (isDocumentVisible && !isCancelled) {
        if (socket)
        {
          socket.emit('documentVisible', { id: socket.id });
        }
      }
      return () => {
        isCancelled = true;
      };
    }, [isDocumentVisible]);

    useEffect(() => {
      if (socket) {
        socket.on('connect', () => {
          console.log('a user connected');
        });
        socket.on('startGame', ({players, bball}) => {
          setIsLoading(false); // Set loading to false when the game starts
          setShowSbox(false);
          setshowGame(true);
          setPlayers(players);
          console.log('start game', bball, 'players: ', players);
          bballRef.current = bball;
        });
      }
    }, [socket]);
    useEffect(() => {
      if (showGame && socket) {
        console.log('ball: ', bballRef.current);
        game(socket, players, bballRef.current);
      }
    } , [showGame]);

    return (
        <>
            <Navbar></Navbar>
            
            {showSbox && (
                <Sbox
                    btitle="Play"
                    stitle="Goat pong"
                    lb="Play with friend"
                    rb="Matchmaking"
                    isLoading = {isLoading} // Pass the loading state to the loading component
                    handleMatchClick={handleMatchClick}
                    handleFriendClick={handleFriendClick}
                >
                </Sbox>
            )}
            {showGame &&
                <div className="game_container" id="game_container">
                    <div className="pong" id="pong">
                    </div>
                </div>
            }
        </>
    );
};