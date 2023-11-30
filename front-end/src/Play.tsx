import { useEffect } from 'react';
import Navbar from './Components/Navbar.tsx';
import Sbox from './Components/Sbox.tsx';
import {io, Socket} from "socket.io-client";
import  './styles/css/main.css'
import { useState } from 'react';
import { SVG, on, Rect, Circle } from '@svgdotjs/svg.js';
import { Number } from 'svg.js';
// import {pod1} from './assets/g2.svg';
// import {pod2} from './assets/g3.svg';

export function Play() {
    // define a type of one plaer
    interface Player {
        s_id: string;
        host: boolean;
        x: number;
        y: number;
        paddleDirection: number;
        paddle? : Rect;
        paddleSpeed : number;
    }
    
    // define a type of all players
    interface Players {
        [key: string]: Player;
    }

    // define a type of ball
    interface Ball {
      cx: number;
      cy: number;
      cercle : Circle;
      vx: number;
      vy: number;
    }

    let pHost: Player;
    let pGuest: Player;
    let ball: Ball;

    let end : any

    let playerLeft : number = 0
    let playerRight : number = 0

    const game = (socket: Socket, players: Players = {}, bball: Ball) => {
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
      // define paddle size
      const paddleWidth = 20,
        paddleHeight = 100;
      ball = bball!;
      pHost = Object.values(players).find(player => player.host === true)!;
      pGuest = Object.values(players).find(player => player.host === false)!;
      pHost.paddle = draw.rect(paddleWidth, paddleHeight).radius(12).x(0).cy(height / 2).fill(host_gradient);
      pGuest.paddle = draw.rect(paddleWidth, paddleHeight).radius(12).x(width - paddleWidth).cy(height / 2).fill(guest_gradient);

      const ballSize = 20;
      ball.cercle = draw.circle(ballSize).center(width / 2, height / 2).fill('#ff69b4');
  
      // game logic
      //var difficulty = 2
      var vx = 0
      , vy = 0
      ball.vx = vx;
      ball.vy = vy;
      
      // define initial player score and create text
      {
        playerLeft = 0
        playerRight = 0

        // create text for the score, set font properties
        var scoreLeft : any
        scoreLeft = draw.text("0").font({
        size: 32,
        family: 'Menlo, sans-serif',
        anchor: 'end',
        fill: '#fff'
        }).move(width/2-10, 10) 

        // cloning rocks!
        // var scoreRight = scoreLeft.clone()
        // .text(playerRight+'')
        // .font('anchor', 'start')
        // .x(width/2+10)

        var scoreRight : any
        scoreRight = draw.text("0").font({
        size: 32,
        family: 'Menlo, sans-serif',
        anchor: 'end',
        fill: '#fff'
        }).move(width/2+20, 10)
      }


      draw.on('click', function() {
          if (vx === 0 && vy === 0) {
              vx = Math.random() * 500 - 250
              vy = Math.random() * 500 - 250
              while (Math.abs(vx) < 100) {
                  vx = Math.random() * 500 - 250
              }
              while (Math.abs(vy) < 100) {
                  vy = Math.random() * 500 - 250
              }
              socket.emit('moveBall', { vx: vx, vy: vy, cx: ball.cercle.cx(), cy: ball.cercle.cy() });
            }
      })
      let chck = false;
      socket.on('move', (data: { paddleDirection: number, id: string }) => {
        chck = true;
        if (pGuest && data.id == pGuest.s_id)
          pGuest.paddleDirection = data.paddleDirection;
        if (pHost && data.id == pHost.s_id)
          pHost.paddleDirection = data.paddleDirection;
      });

      let isKeyDown = false;

      on(document, 'keydown', function (e: any) {
        if (!chck) {
          if (e.keyCode == 40 || e.keyCode == 38) {
            e.preventDefault();
          }

          if (!isKeyDown) {
            isKeyDown = true;
            socket.emit('keydown', { paddleDirection: e.keyCode == 40 ? 1 : e.keyCode == 38 ? -1 : 0, id: socket.id });
          }
        }
      });

      on(document, 'keyup', function (e: any) {
        if (!chck) {
          if (e.keyCode == 40 || e.keyCode == 38) {
            e.preventDefault();
            isKeyDown = false;
            socket.emit('keyup', { paddleDirection: 0, id: socket.id });
          }
        }
      });

      socket.on('ballVel', (data) => {
        console.log("move ", Date.now());
        vx = data.vx;
        vy = data.vy;
        ball.cercle.cx(data.cx);
        ball.cercle.cy(data.cy);
      });
      console.log("waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa=====================================waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
      // update is called on every animation step
      function update(dt: number) {
        // check if a player missed the ball, score and reset
        
        // check if we hit top/bottom borders
        // on the host side the ball reaches the "borders" and emits a move event
        // on the guest side the move event is received and the ball is switched to the new velolcity but it lost some pixels
        if (vx != 0 && vy != 0)
          ball.cercle.dmove(vx*dt, vy*dt)
        var cx = ball.cercle.cx()
        , cy = ball.cercle.cy()
        console.log("cx: ", cx, " cy: ", cy);
        if ((vy < 0 && cy <= 0) || (vy > 0 && cy >= height)) {
            console.log("wall ", Date.now());
            socket.emit('moveBall', { vx: vx, vy: -vy, cx, cy });
        }
        // check if we hit the paddle
        else {
          var paddleRightY: number = 0;
          if (pGuest && pGuest.paddle) {
            paddleRightY = parseInt(pGuest.paddle.y().valueOf().toString());
          }
          var paddleLeftY: number = 0;
          if (pHost && pHost.paddle) {
            paddleLeftY = parseInt(pHost.paddle.y().valueOf().toString());
          }
          if ((vx < 0 && cx <= paddleWidth && cy > paddleLeftY && cy < paddleLeftY + paddleHeight) ||
          (vx > 0 && cx >= width - paddleWidth && cy > paddleRightY && cy < paddleRightY + paddleHeight)) {
              console.log("paddle ", Date.now());

              socket.emit('moveBall', { vx: -vx * 1.05, vy: (cy - ((vx < 0 ? paddleLeftY : paddleRightY) + paddleHeight/2)) * 7 , cx, cy});
          }
          else if ((vx < 0 && cx <= 0) || (vx > 0 && cx >= width)) {
            // when x-velocity is negative, its a point for player 2, else player 1
            if (vx < 0) { ++playerRight }
            else { ++playerLeft }
            scoreLeft.text(playerRight)
            scoreRight.text(playerLeft)
  
            reset()
          }
        }
        
        // game over
        if (playerRight === 10 || playerLeft === 10) {
            reset()
            // Remove the ball from the SVG
            // ball.cercle.remove();
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
        // move player paddle
      }

      var lastTime: number | undefined, animFrame;

      function callback(ms: number) {
          // we get passed a timestamp in milliseconds
          // we use it to determine how much time has passed since the last call

          if (lastTime) {
              update((ms-lastTime)/1000) // call update and pass delta time in seconds
          }
          lastTime = ms
          animFrame = requestAnimationFrame(callback)
      }

      callback(300)
      // define paddle direction and speed
      function reset() {
          console.log("reset", vx, " ", vy);
          // reset speed values
          vx = 0
          vy = 0
          
          // position the ball back in the middle
          ball.cercle.animate(300).center(width / 2, height / 2)
          
          // reset the position of the paddles
          if (pHost && pHost.paddle) {
            pHost.paddle.animate(300).cy(height / 2)
          }
          if (pGuest && pGuest.paddle) {
            pGuest.paddle.animate(300).cy(height / 2)
          }
      }

      const cleanup = () => {
        draw.clear();
        draw.remove();
      };
  
      return cleanup;
    };
    
    const [showSbox, setShowSbox] = useState(true);
    const [showGame, setshowGame] = useState(true);    
    const [socket, setSocket] = useState<Socket | null>(null);

    const handleMatchClick = async () => {
        const socket = io("http://10.14.5.8:3000/events", {
            transports: ['websocket'],
        });
        setSocket(socket);
    };
    useEffect(() => {
        if (socket) {
          socket.on('connect', () => {
            console.log('a user connected');
          });
          socket.on('currentPlayers', (players: any, ball: any) => {
            console.log("players: ", players);
            setShowSbox(false);
            setshowGame(true);
            game(socket, players, ball);
          });
        }
      }, [socket]);
    return (
        <>
            <Navbar></Navbar>
            {showSbox && (
                <Sbox
                    btitle="Play"
                    stitle="Goat pong"
                    lb="Play with friend"
                    rb="Matchmaking"
                    onClick={handleMatchClick}
                ></Sbox>
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