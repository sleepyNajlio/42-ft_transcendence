import { Player, Players, Ball, User } from './types';
import { Socket } from "socket.io-client";
import { SVG, on, Text } from '@svgdotjs/svg.js';
import logo  from '../assets/game/Logotype.svg'
import Playsvg from '../assets/game/Button/Play.svg'
import Background from '../assets/game/Background/Pattern.svg'
import Hole from '../assets/game/Props/Hole.svg'

let pHost: Player;
let pGuest: Player;

let playerLeft : number = 0
let playerRight : number = 0

export default function game(socket: Socket, players: Players = {}, ball: Ball, user: User, initia: () => void): () => void {
    // define board size and create a svg board
    const width = 600,
      height = 600;
    const draw = SVG().addTo('#pong').size(width, height).attr({ fill: '#f06' });
    // draw the board
    var pattern = draw.image(Background);
    
    var guest_gradient = draw.gradient('linear', function(add) {
      add.stop(0, '#A1FFCE')
      add.stop(1, '#FAFFD1')
    })
    var host_gradient = draw.gradient('linear', function(add) {
      add.stop(0, '#606c88')
      add.stop(1, '#3f4c6b')
    })
    draw.image(Hole).size(30, 30).move(width/2 -15, height/2 - 15).back();
    draw.rect(width, height).fill(pattern).back();
    const paddleWidth = 20,
      paddleHeight = 100;
    pHost = Object.values(players).find(player => player.host === true)!;
    pGuest = Object.values(players).find(player => player.host === false)!;
    pHost.paddle = draw.rect(paddleWidth, paddleHeight).radius(12).x(0).cy(height / 2).fill(host_gradient).hide();
    pGuest.paddle = draw.rect(paddleWidth, paddleHeight).radius(12).x(width - paddleWidth).cy(height / 2).fill(guest_gradient).hide();

    const ballSize = 20;
    ball.cercle = draw.circle(ballSize).center(width / 2, height / 2).fill('#50E3C2');

    ball.vx = 0;
    ball.vy = 0;
    ball.cx = ball.cercle.cx();
    ball.cy = ball.cercle.cy();
  
    var scoreLeft : Text
    scoreLeft = draw.text("0").font({
      family: 'Josefin Sans',
      size: 60,
      weight: 700,
      letterSpacing: '0px',
      whitespace: 'pre',
    })
    .fill('#50E3C2').move(width/4, 10).hide();
    var scoreRight = scoreLeft.clone().x(3*width/4).addTo(draw).hide();

    var nested = draw.nested()
    const text = draw.text('Game Aborted')
    .font({
      family: 'Josefin Sans',
      size: 65,
      weight: 500,
      letterSpacing: '0px',
      whitespace: 'pre',
    })
    .fill('#50E3C2')
    .cx(width/2).cy(height/2).hide();
    // const text2 = draw.text('Go Back to Lobby')
    // .font({
    //   family: 'Josefin Sans',
    //   size: 80,
    //   weight: 500,
    //   letterSpacing: '0px',
    //   whitespace: 'pre',
    // })
    // .fill('#50E3C2')
    // .cx(width/2).cy(height/2 + 70).hide();


    nested.image(logo).size(200, 100).move(width/2 - 100, 70);
    nested.image(Playsvg).size(200, 200).move(width/2 - 100, height/2 - 70);
    nested.add(text);
    // nested.add(text2);

    nested.click(function() {
      console.log("clicked")
      if (ball.vx === 0 && ball.vy === 0) {
        let tvx = Math.random() * 500 - 250
        let tvy = Math.random() * 500 - 250
        while (Math.abs(tvx) < 100) {
          tvx = Math.random() * 500 - 250
        }
        while (Math.abs(tvy) < 100) {
          tvy = Math.random() * 500 - 250
        }
        socket.emit('moveBall', { ball: {vx: tvx, vy: tvy, cx: ball.cx, cy: ball.cy}, action: "start", userId: pHost.user_id });
      }
    })
    let chck = false;
    socket.on('opponentDisconnected', () => {
      reset(playerRight, playerLeft);
      nested.children()[1].show();
    });
    const animateText = (child: Text, text: string, index: number) => {
      if (index <= text.length) {
        // Set the text content with the characters up to the current index
        child.text(text.substring(0, index)).cx(width/2);
        // Schedule the next animation after a delay of 0.3 seconds
        setTimeout(() => {
          animateText(child, text, index + 1);
        }, 300);
      }
    };
    
    socket.on('winByAbort', () => {
      reset(playerRight, playerLeft)
      pHost.paddle?.hide();
      pGuest.paddle?.hide();
      nested.children()[0].show();
      nested.children()[1].hide();
      nested.children()[2].show();
      setTimeout(() => {
        animateText(nested.children()[2] as Text, "Go Back to Lobby", 0)
        setTimeout(() => {
          nested.children()[1].show().scale(-1, 1).animate(3000).cy(height - 120);
        }, 3000);
      }, 1000);
      console.log("game aborted");
      nested.children()[1].click(function() {
        console.log("clicked")
        cleanup();
        initia();
      });
    });

    socket.on('move', (data) => {
      chck = true;
      console.log(`move ${data.userId} ${pGuest.user_id} ${pHost.user_id}`);
      if (pGuest && data.userId == pGuest.user_id)
      {
        pGuest.paddleDirection = data.paddleDirection;
        console.log("player"+data.userId);
      }
      if (pHost && data.userId == pHost.user_id)
      {
        pHost.paddleDirection = data.paddleDirection;
        console.log("player"+data.userId);
      }
        ball = {
          ...ball,
          ...data.ball,
        }
    });

    let isKeyDown = false;
    socket.on('getFrame', (data) => {
      if (pGuest && pGuest.paddle && pHost && pHost.paddle)
        socket.emit('paddlePos', { y1: pGuest.paddle.cy(), y2: pHost.paddle.cy(),  playerLeft, playerRight, ball: {cx: ball.cx, cy: ball.cy, vx: ball.vx, vy: ball.vy}, userId: pGuest.user_id});
    });
    
    socket.on('updateFrame', (data: {ball: {cx : number, cy: number, vx: number, vy: number}, y1: number, y2: number, playerLeft: number, playerRight: number, id: string }) => {
      if (pHost && pHost.paddle)
        pHost.paddle.cy(data.y2);
      if (pGuest && pGuest.paddle)
        pGuest.paddle.cy(data.y1);
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
            socket.emit('keydown', { ball: ballWithoutCercle, paddleDirection: e.keyCode == 40 ? 1 : e.keyCode == 38 ? -1 : 0, userId: user.id_player });
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
          socket.emit('keyup', { ball: ballWithoutCercle, paddleDirection: 0, userId: user.id_player  });
        }
      }
    });

    socket.on('start', (data: {ball: Ball }) => {
      scoreRight.show();
      scoreLeft.show();
      ball = {
        ...ball,
        ...data.ball,
      }
      nested.children()[0].hide();
      nested.children()[1].hide();
      pHost.paddle?.show();
      pGuest.paddle?.show();
      ball.cercle.show();
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
      ball.cercle.animate(20).center(width/2, height/2)
      playerLeft = data.playerLeft;
      playerRight = data.playerRight;
      scoreLeft.text(playerRight.toString())
      scoreRight.text(playerLeft.toString())
      if (ball.vx === 0 && ball.vy === 0) {
        let tvx = Math.random() * 500 - 250
        let tvy = Math.random() * 500 - 250
        while (Math.abs(tvx) < 100) {
          tvx = Math.random() * 500 - 250
        }
        while (Math.abs(tvy) < 100) {
          tvy = Math.random() * 500 - 250
        }
        socket.emit('moveBall', { ball: {vx: tvx, vy: tvy, cx: ball.cx, cy: ball.cy}, action: "start", userId: pHost.user_id });
      }
    });

    socket.on('ballVel', (data:{reset: Boolean, ball: Ball}) => {
      ball = {
        ...ball,
        ...data.ball,
      }
      ball.cercle.animate(20).center(ball.cx, ball.cy)
    });
    function update(dt: number) {
      if (ball.vx != 0 && ball.vy != 0)
        ball.cercle.dmove(ball.vx*dt, ball.vy*dt)
      ball.cx = ball.cercle.cx()
      , ball.cy = ball.cercle.cy()
      if ((ball.vy < 0 && ball.cy <= 0) || (ball.vy > 0 && ball.cy >= height)) {
        socket.emit('moveBall', { ball: { vx: ball.vx, vy: -ball.vy, cx: ball.cx, cy: ball.cy}, action: "up", userId: pHost.user_id });
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
          socket.emit('moveBall', { ball: { vx: -ball.vx * 1.05, vy: (ball.cy - ((ball.vx < 0 ? paddleLeftY : paddleRightY) + paddleHeight/2)) * 7 , cx: ball.cx, cy: ball.cy}, action: "left -right", userId: pHost.user_id});
        }
        else if ((ball.vx < 0 && ball.cx <= 0) || (ball.vx > 0 && ball.cx >= width)) {
          if (ball.vx < 0) { reset(playerRight+1, playerLeft) }
          else { reset(playerRight, playerLeft+1) }
        }
      }
      if (playerRight === 10 || playerLeft === 10) {
          reset(playerRight, playerLeft)
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
      socket.emit('moveBall', { ball: { vx: 0, vy: 0, cx: width / 2, cy: height / 2 , reset: true}, action: "reset", playerLeft, playerRight, userId: pHost.user_id });
    }
    const cleanup = () => {
        draw.clear();
        draw.remove();
        socket.off('move');
        socket.off('start');
        socket.off('reset');
        socket.off('ballVel');
        socket.off('opponentDisconnected');
        socket.off('updateFrame');
        socket.off('getFrame');
        socket.off('keydown');
        socket.off('keyup');
        cancelAnimationFrame(animFrame);
      }
      
      return cleanup;
  };