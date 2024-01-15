import { Player, Players, Ball, User } from './types';
import { Socket } from "socket.io-client";
import { SVG, on, Text } from '@svgdotjs/svg.js';

let pHost: Player;
let pGuest: Player;
let end : Text

let playerLeft : number = 0
let playerRight : number = 0

export default function game(socket: Socket, players: Players = {}, ball: Ball, user: User) {
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
    end = draw.text(``).font({
      size: 32,
      family: 'Menlo, sans-serif',
      anchor: 'end',
      fill: '#fff'
    }).center(width/2, height/2).hide();
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
      if (end) {
        end.remove();
      }
      reset(playerRight, playerLeft);
      rect.show();
      click.show();
    });
    socket.on('winByAbort', () => {
      reset(playerRight, playerLeft)
      click.hide();
      end.show();
      end.front();

      let counter = 2;
      const intervalId = setInterval(() => {
        end.text(`Game Aborts in ${counter}`);
        
        counter--;
        if (counter < 0) {
          clearInterval(intervalId);
          end.text('Game Aborted');

        }
      }, 1000);
      
      console.log("game aborted");
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
          end.text('Game over').font({
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
      socket.emit('moveBall', { ball: { vx: 0, vy: 0, cx: width / 2, cy: height / 2 , reset: true}, action: "reset", playerLeft, playerRight, userId: pHost.user_id });
      rect.show();
      click.show();
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