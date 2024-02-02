import { Player, Players, Ball, User, user, user_stats } from './types';
import { Socket } from "socket.io-client";
import { SVG, on, Text } from '@svgdotjs/svg.js';
import logo  from '../assets/game/Logotype.svg'
import Playsvg from '../assets/game/Button/Play.svg'
import Background from '../assets/game/zig-zag.svg'
import Background1 from '../assets/game/khezi.svg'
import Background2 from '../assets/game/sor.svg'
import Hole from '../assets/game/Props/Hole.svg'
import Ballsvg from '../assets/game/pokeball.svg'
import { padlPattern1, padlPattern2, padlPattern3, boardPattern1, boardPattern2, boardPattern3 } from './patterns';


const animateText = (child: Text, text: string, index: number, width: number = 600) => {
  if (index <= text.length) {
    // Set the text content with the characters up to the current index
    child.text(text.substring(0, index)).cx(width/2);
    // Schedule the next animation after a delay of 0.3 seconds
    setTimeout(() => {
      animateText(child, text, index + 1, width);
    }, 100);
  }
};

function boardData(ball: Ball, pHost: Player, pGuest: Player, scoreLeft: Text, scoreRight: Text, data: {ball: Ball, playerLeft: number, playerRight: number}, ratio: number){
  data.ball.cx = data.ball.cx * ratio;
  // data.ball.cy = data.ball.cy * ratio;
  data.ball.vx = data.ball.vx * ratio;
  // data.ball.vy = data.ball.vy * ratio;
  ball = {
    ...ball,
    ...data.ball,
  }
  ball.cercle?.animate(20).center(ball.cx, ball.cy)
  pHost.score = data.playerLeft;
  pGuest.score = data.playerRight;
  scoreLeft.text(pHost.score.toString())
  scoreRight.text(pGuest.score.toString())
}

function launchBall(socket: Socket, ball: Ball, pHost: Player, ratio: number, dificulty: number = 3) {
  if (ball.vx === 0 && ball.vy === 0) {
    let tvx = Math.random() * dificulty * 64;
    let tvy = Math.random() * dificulty * 64;
    while (30 * dificulty > Math.abs(tvx)) {
      tvx = Math.random() * dificulty * 64;
    }
    while (30 * dificulty > Math.abs(tvy)) {
      tvy = Math.random() * dificulty * 64;
    }
    console.log(`tvx: ${tvx}, tvy: ${tvy}, cx: ${ball.cx}, cy: ${ball.cy}` );
    socket.emit('moveBall', { ball: {vx: tvx, vy: tvy , cx: ball.cx / ratio, cy: ball.cy}, action: "start", userId: pHost.user_id });
  }
}

function endGame(width: number, height: number, message: string, nested: any, initia: () => void, pHost: Player, pGuest: Player, cleanup: () => void) {
  pHost.paddle?.hide();
  pGuest.paddle?.hide();
  nested.children()[0].show();
  nested.children()[1].hide();
  nested.children()[2].text(message).show().cx(width/2);
  setTimeout(() => {
    animateText(nested.children()[2] as Text, "Go Back to Lobby", 0, width)
    setTimeout(() => {
      nested.children()[1].show().scale(-1, 1).animate(1000).cy(height - 120);
    }, 1000);
  }, 2000);
  console.log(message);
  nested.children()[1].off('click');
  nested.children()[1].click(function() {
    initia();
    nested.children()[1].off('click');
  });
}

const reset = async (playerRight: number = 0, playerLeft: number = 0, width: number = 600, height: number, socket: Socket, pHost: Player, pGuest: Player) => {
  if (playerLeft === 10 || playerRight === 10)
    socket.emit('moveBall', { ball: { vx: 0, vy: 0, cx: width / 2, cy: height / 2 , reset: true}, action: "done", playerLeft, playerRight, userId: pHost.user_id });
  else
    socket.emit('moveBall', { ball: { vx: 0, vy: 0, cx: width / 2, cy: height / 2 , reset: true}, action: "reset", playerLeft, playerRight, userId: pHost.user_id });
}


export default function game(started: Boolean = false, socket: Socket, dificulty: number = 10, gameId: number | null, Board: number, players: Players = {}, ball: Ball, width: number, user: User, ratio: number, vxratio: number, initia: () => void, updatestats: (win:Boolean) => void, updateHistory: (gameId: number) => void): () => void {
    // define board size and create a svg board
    // console.log("game ratio ", ratio);
    let pHost: Player;
    let pGuest: Player;
    // width = width * 0.9 > 900 ? 900 : width * 0.9;
    const height = 600;
    const draw = SVG().addTo('#pong').size(width, height).attr({ fill: '#f06' });
    const paddleWidth = 20 ,
    paddleHeight = 100;
    const ballSize = 20 ;
    {
      // var pattern = draw.image(Background2);
      var guest_gradient = draw.gradient('linear', function(add) {
        add.stop(0, '#A1FFCE')
        add.stop(1, '#FAFFD1')
      })
      var host_gradient = draw.gradient('linear', function(add) {
        add.stop(0, '#606c88')
        add.stop(1, '#3f4c6b')
      })
      draw.image(Hole).size(30 , 30 ).move(width/2 -(15 ), height/2 - (15 )).back();
      if (Board === 1)
        draw.rect(width, height).fill(boardPattern1(draw)).radius(20).back();
      else if (Board === 2)
        draw.rect(width, height).fill(boardPattern2(draw)).radius(20).back();
      else if (Board === 3)
        draw.rect(width, height).fill(boardPattern3(draw)).radius(20).back();
      
      pHost = Object.values(players).find(player => player.host === true)!;
      pGuest = Object.values(players).find(player => player.host === false)!;
      if (pHost.padl === 1)
        pHost.paddle = draw.rect(paddleWidth, paddleHeight).radius(12 ).x(0).cy(height / 2).fill(padlPattern1(draw));
      else if (pHost.padl === 2)
        pHost.paddle = draw.rect(paddleWidth, paddleHeight).radius(12 ).x(0).cy(height / 2).fill(padlPattern2(draw));
      else if (pHost.padl === 3)
        pHost.paddle = draw.rect(paddleWidth, paddleHeight).radius(12 ).x(0).cy(height / 2).fill(padlPattern3(draw));
      if (pGuest.padl === 1)
        pGuest.paddle = draw.rect(paddleWidth, paddleHeight).radius(12 ).x(width - paddleWidth).cy(height / 2).fill(padlPattern1(draw));
      else if (pGuest.padl === 2)
        pGuest.paddle = draw.rect(paddleWidth, paddleHeight).radius(12 ).x(width - paddleWidth).cy(height / 2).fill(padlPattern2(draw));
      else if (pGuest.padl === 3)
        pGuest.paddle = draw.rect(paddleWidth, paddleHeight).radius(12 ).x(width - paddleWidth).cy(height / 2).fill(padlPattern3(draw));
      // pHost.paddle = draw.rect(paddleWidth, paddleHeight).radius(12 ).x(0).cy(height / 2).fill(host_gradient).hide();
      // pGuest.paddle = draw.rect(paddleWidth, paddleHeight).radius(12 ).x(width - paddleWidth).cy(height / 2).fill(guest_gradient).hide();

      // ball.cercle = draw.circle(ballSize).center(width / 2, height / 2);

      // Create a group to hold all Poké Ball elements
      var pokeBallGroup = draw.group();
  
      // Draw a circle
      // var circle = pokeBallGroup.circle(30).attr({
      //   fill: '#f06',   // Fill color
      //   stroke: '#000',  // Stroke color
      //   'stroke-width': 2,  // Stroke width
      //   // cx: 0,  // Initial center x-coordinate
      //   // cy: 0   // Initial center y-coordinate
      // }).center(0, 0);
  
      // Draw a white circle inside the red circle
      var innerCircle = pokeBallGroup.circle(ballSize).attr({
        // fill: '#fff',
        fill: 'url(#pokeBallGradient)',
        stroke: '#000',
        'stroke-width': 3 ,
        // cx: 100,  // Initial center x-coordinate
        // cy: 100   // Initial center y-coordinate
      }).center(0, 0);
  
      // Draw a black horizontal band in the center
      var band = pokeBallGroup.rect(3 , ballSize).attr({
        fill: '#000',
        y: 140
      }).center(0, 0);
      draw.gradient('linear', function(add) {
        add.stop(0, '#f06');   // Red at the top
        add.stop(0.5, '#f06'); // Red at the middle (smooth transition)
        add.stop(0.5, '#fff'); // White at the middle (smooth transition)
        add.stop(1, '#fff');   // White at the bottom
      }).from(0, 0).to(0, 1).id('pokeBallGradient');
  
  
      draw.gradient('linear', function(add) {
        add.stop(0, '#f06');   // Red at the top
        add.stop(0.5, '#f06'); // Red at the middle (smooth transition)
        add.stop(0.5, '#fff'); // White at the middle (smooth transition)
        add.stop(1, '#fff');   // White at the bottom
      }).id('pokeBallGradient');
  
      // Draw a small white circle at the top
      var button = pokeBallGroup.circle(7).attr({
        fill: '#fff',
        stroke: '#000',
        'stroke-width': 3 ,
        // cx: 0,  // Initial center x-coordinate
        // cy: 0   // Initial center y-coordinate
      }).center(0, 0);
  
      // Change the center (cx, cy) of the entire group
      pokeBallGroup.cx(width / 2).cy(height / 2);
      function rotateContinuously() {
        band.rotate(1);
        requestAnimationFrame(rotateContinuously);
      }

      // Start continuous rotation
      rotateContinuously();
  
      // Move the entire group to a new position (e.g., on a button click)
      // function moveGroup(newCx, newCy) {
      //   pokeBallGroup.center(newCx, newCy);
      // }
  
      // Create a pattern from the image
      // let patterna = draw.pattern(ballSize, ballSize, function(add) {
      //   // Center the image within the pattern
      //   add.image(Ballsvg).size(30, 30).move(0, 0);
      // });
      
      // '100%'
      // Fill the circle with the pattern
      // ball.cercle.fill(patterna);
      ball.cercle = pokeBallGroup;
      
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
      nested.image(logo).size(200, 100).move(width/2 - 100, 70);
      nested.image(Playsvg).size(200, 200).move(width/2 - 100, height/2 - 70);
      nested.add(text);
    }

    nested.children()[1].click(function() {
      console.log("clicked")
      launchBall(socket, ball, pHost, ratio, dificulty);
    })
    let chck = false;
    
    if (started){
      socket.emit('documentVisible', { id: socket.id, userId: user.id_player });
      scoreRight.show();
      scoreLeft.show();
      nested.children()[0].hide();
      nested.children()[1].hide();
      pHost.paddle?.show();
      pGuest.paddle?.show();
      ball.cercle.show();
    }
    
    socket.on('winByAbort', (data:{gameId:number}) => {
      console.log("winByAbort", gameId);
      updateHistory(gameId as number);
      updatestats(true);
      reset(pGuest.score, pHost.score, width, height, socket, pHost, pGuest);
      endGame(width, height, "Game Aborted", nested, initia, pHost, pGuest, cleanup)
      return cleanup;
    });

    let isKeyDown = false;
    socket.on('getFrame', (data, ack) => {
      ack('Acknowledgement from server');
      console.log("catched getFrame");
      if (pGuest && pGuest.paddle && pHost && pHost.paddle)
        socket.emit('paddlePos', { y1: pGuest.paddle.cy(), y2: pHost.paddle.cy(),  playerLeft: pHost.score, playerRight: pGuest.score, ball: {cx: ball.cx / ratio, cy: ball.cy, vx: ball.vx / vxratio, vy: ball.vy}, userId: pGuest.user_id});
      return true;
    });

    socket.on('initFrame', (data: {ball: Ball, y1: number, y2: number, playerLeft: number, playerRight: number, id: string }) => {
      nested.children()[1].show();
      pHost.score = data.playerLeft;
      pGuest.score = data.playerRight;
      scoreLeft.text(data.playerLeft.toString())
      scoreRight.text(data.playerRight.toString())
      setTimeout(() => {
        launchBall(socket, ball, pHost, ratio, dificulty);
      }, 2000);
    });

    socket.on('updateFrame', (data: {ball: Ball, y1: number, y2: number, playerLeft: number, playerRight: number, id: string }) => {
      // const {playerLeft, playerRight} = data;
      if (pHost && pHost.paddle)
        pHost.paddle.cy(data.y2);
      if (pGuest && pGuest.paddle)
        pGuest.paddle.cy(data.y1);
      // send with ball playerLeft playerRight only
      data.ball.cx = data.ball.cx * ratio;
      // data.ball.cy = data.ball.cy * ratio;
      data.ball.vx = data.ball.vx * ratio;
      // data.ball.vy = data.ball.vy * ratio;
      ball = {
        ...ball,
        ...data.ball,
      }
      ball.cercle?.center(ball.cx, ball.cy)
      pHost.score = data.playerLeft;
      pGuest.score = data.playerRight;
      scoreLeft.text(pHost.score.toString())
      scoreRight.text(pGuest.score.toString())
        // boardData(ball, pHost, pGuest, scoreLeft, scoreRight, {ball, playerLeft, playerRight}, ratio);
    });

    on(document, 'keydown', function (e: any) {
      // const { cercle, ...ballWithoutCercle } = ball;
      // ballWithoutCercle.cx = ballWithoutCercle.cx / ratio;
      // // ballWithoutCercle.cy = ballWithoutCercle.cy / ratio;
      // ballWithoutCercle.vx = ballWithoutCercle.vx / vxratio;
      // ballWithoutCercle.vy = ballWithoutCercle.vy / ratio;
      if (!chck) {
        if (e.keyCode == 40 || e.keyCode == 38) {
          e.preventDefault();
          if (!isKeyDown) {
            isKeyDown = true;
            socket.emit('keydown', { ball: {cx: ball.cx / ratio, cy: ball.cy, vx: ball.vx / ratio, vy: ball.vy}, paddleDirection: e.keyCode == 40 ? 1 : e.keyCode == 38 ? -1 : 0, userId: user.id_player });
          }
        }
      }
    });

    let isMouseDown = false;

    // const element = document.getElementById("pong");
    // var supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints;
    // console.log("supportsTouch", supportsTouch);
    // element?.addEventListener("mousedown", handleMouseDown);
    // element?.addEventListener("mouseup", handleMouseUp);
    // element?.addEventListener("mousemove", handleMouseMove);
    // element?.addEventListener("touchstart", handleMouseDown);
    // element?.addEventListener("touchend", handleMouseUp);
    // element?.addEventListener("touchmove", handleMouseMove);


    // function handleMouseDown(event: MouseEvent | TouchEvent) {
    //   // Check if it's a MouseEvent
    //   if (event instanceof MouseEvent || event instanceof TouchEvent) {
    //     isMouseDown = true;
    //     handleMouseMove(event); // Call handleMouseMove to immediately process the event
    //   }
    // }

    // function handleMouseUp(event: MouseEvent | TouchEvent) {
    //   // Check if it's a MouseEvent
    //   if (event instanceof MouseEvent || event instanceof TouchEvent) {
    //     isMouseDown = false;
    //     // Send the socket.emit event with paddleDirection set to 0
    //     socket.emit('keydown', { ball: {cx: ball.cx / ratio, cy: ball.cy, vx: ball.vx / ratio, vy: ball.vy}, paddleDirection: 0, userId: user.id_player });
    //   }
    // }

    // function handleMouseMove(event: MouseEvent | TouchEvent) {
    //   // Check if it's a MouseEvent and the mouse button is held down
    //   if ((event instanceof MouseEvent || event instanceof TouchEvent) && isMouseDown) {
    //     const element = event.target as HTMLElement;
    //     const rect = element.getBoundingClientRect();
    //     const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    //     const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
    //     const clickX = clientX - rect.left;
    //     const clickY = clientY - rect.top;
    //     console.log("clickX", clickX);

    //     // Now mouseX and mouseY contain the mouse position relative to the element
    //     // You can use these values to update your game state or perform other actions

    //     if ((clickX >= 0 && clickX <= width) && (clickY >= 0 && clickY <= height)) {
    //       if (pHost && pHost.paddle && pHost.user_id === user.id_player) {
    //         if (pHost.paddle?.cy() > clickY) {
    //           console.log("host go up");
    //           socket.emit('keydown', { ball: {cx: ball.cx / ratio, cy: ball.cy, vx: ball.vx / ratio, vy: ball.vy}, paddleDirection: -1, userId: user.id_player });
    //         } else if (pHost.paddle?.cy() < clickY) {
    //           console.log("host go down");
    //           socket.emit('keydown', { ball: {cx: ball.cx / ratio, cy: ball.cy, vx: ball.vx / ratio, vy: ball.vy}, paddleDirection: 1, userId: user.id_player });
    //         }
    //       } else if (pGuest && pGuest.paddle && pGuest.user_id === user.id_player) {
    //         if (pGuest.paddle?.cy() > clickY) {
    //           socket.emit('keydown', { ball: {cx: ball.cx / ratio, cy: ball.cy, vx: ball.vx / ratio, vy: ball.vy}, paddleDirection: -1, userId: user.id_player });
    //           console.log("Guest go up");
    //         } else if (pGuest.paddle?.cy() < clickY) {
    //           socket.emit('keydown', { ball: {cx: ball.cx / ratio, cy: ball.cy, vx: ball.vx / ratio, vy: ball.vy}, paddleDirection: 1, userId: user.id_player });
    //           console.log("Guest go down");
    //         }
    //       }
    //     } else {
    //       console.log("Clicked somewhere else on the element");
    //     }
    //     // socket.emit('keydown', { ball: {cx: ball.cx / ratio, cy: ball.cy, vx: ball.vx / ratio, vy: ball.vy}, paddleDirection: paddleDirection, userId: user.id_player });
    //   }
    // }


    on(document, 'keyup', function (e: any) {
      // const { cercle, ...ballWithoutCercle } = ball;
      // ballWithoutCercle.cx = ballWithoutCercle.cx / ratio;
      // // ballWithoutCercle.cy = ballWithoutCercle.cy / ratio;
      // ballWithoutCercle.vx = ballWithoutCercle.vx / vxratio;
      // // ballWithoutCercle.vy = ballWithoutCercle.vy / ratio;
      if (!chck) {
        if (e.keyCode == 40 || e.keyCode == 38) {
          e.preventDefault();
          isKeyDown = false;
          socket.emit('keyup', { ball: {cx: ball.cx / ratio, cy: ball.cy, vx: ball.vx / ratio, vy: ball.vy}, paddleDirection: 0, userId: user.id_player, pG: pGuest.paddle?.cy(), pH: pHost.paddle?.cy() });
        }
      }
    });

    socket.on('start', (data: {ball: Ball }) => {
      console.log("received start ", data.ball.vx, "  ", data.ball.vy);
      scoreRight.show();
      scoreLeft.show();
      // data.ball.cx = data.ball.cx * ratio;
      // data.ball.cy = data.ball.cy * ratio;
      data.ball.vx = data.ball.vx * vxratio;
      // data.ball.vy = data.ball.vy * ratio;
      data.ball.cx = width / 2;
      data.ball.cy = height / 2;
      console.log("rt received start ", data.ball.vx, "  ", data.ball.vy);
      ball = {
        ...ball,
        ...data.ball,
      }
      nested.children()[0].hide();
      nested.children()[1].hide();
      pHost.paddle?.show();
      pGuest.paddle?.show();
      ball.cercle.show();
      setTimeout(() => {
        launchBall(socket, ball, pHost, ratio, dificulty);
      }, 2000);
    });


    socket.on('done', async (data: {gameId:number, playerRight: number, playerLeft: number, winnerId: number, loserId: number }) => {
      ball = {
        ...ball,
        ...{vx: 0, vy: 0},
      }
      updateHistory(gameId as number);
      ball.cercle.center(width/2, height/2)
      ball.cercle.hide();
      pHost.score = data.playerLeft;
      pGuest.score = data.playerRight;
      scoreLeft.text(pHost.score.toString())
      scoreRight.text(pGuest.score.toString())
      // let gameId : any = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/game/${user.id_player}/getgame/PLAYING`, { withCredentials: true });
      // if (gameId && gameId.data && !Number.isNaN(gameId.data.id_game))
      // {
      //   gameId = gameId.data.id_game;
      //   console.log("sending gameId", gameId);
      //   await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/game/${gameId}/updateGame`,{status: "FINISHED"}, { withCredentials: true });
      //   await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/game/${gameId}/${data.winnerId}/updateUserGame`,{win : 1, score: Math.max(pHost.score, pGuest.score)}, { withCredentials: true });
      //   await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/game/${gameId}/${data.loserId}/updateUserGame`,{win : 0, score: Math.min(pHost.score, pGuest.score)}, { withCredentials: true });
      // }
      console.log("winnerId", data.winnerId);
      console.log("loserId", data.loserId);
      console.log("user.id_player", user.id_player);
      const id: number = Number(user.id_player);
      const winid: number = Number(data.winnerId);
      console.log("id", gameId);
      if (winid === id){
        updatestats(true);
        endGame(width, height, "You Won !", nested, initia, pHost, pGuest, cleanup)
      }
      else{
        updatestats(false);
        endGame(width, height, "You Lost !", nested, initia, pHost, pGuest, cleanup)
      }
      return cleanup;
    });
    socket.on('reset', (data: {ball: Ball, playerRight: number, playerLeft: number }) => {
      if (pHost && pHost.paddle) {
        pHost.paddle.animate(20).cy(height / 2)
      }
      if (pGuest && pGuest.paddle) {
        pGuest.paddle.animate(20).cy(height / 2)
      }
      data.ball.cx = data.ball.cx * ratio;
      // data.ball.cy = data.ball.cy * ratio;
      data.ball.vx = data.ball.vx * vxratio;
      // data.ball.vy = data.ball.vy * ratio;
      ball = {
        ...ball,
        ...data.ball,
      }
      ball.cercle.center(ball.cx, ball.cy)
      ball.cercle.animate(20).center(width/2, height/2)
      pHost.score = data.playerLeft;
      pGuest.score = data.playerRight;
      scoreLeft.text(pHost.score.toString())
      scoreRight.text(pGuest.score.toString())
      console.log('reseted ball', ball);
      if (ball.vx === 0 && ball.vy === 0) {
        let tvx = Math.random() * dificulty * 64;
        let tvy = Math.random() * dificulty * 64;
        while (30 * dificulty > Math.abs(tvx)) {
          tvx = Math.random() * dificulty * 64;
        }
        while (30 * dificulty > Math.abs(tvy)) {
          tvy = Math.random() * dificulty * 64;
        }
        socket.emit('moveBall', { ball: {vx: tvx , vy: tvy, cx: ball.cx / ratio, cy: ball.cy}, action: "start", userId: pHost.user_id });
      }
    });
    socket.on('move', (data) => {
      chck = true;
      if (pGuest && data.userId == pGuest.user_id)
      {
        pGuest.paddleDirection = data.paddleDirection;
      }
      if (pHost && data.userId == pHost.user_id)
      {
        pHost.paddleDirection = data.paddleDirection;
      }
      data.ball.cx = data.ball.cx * ratio;
      // data.ball.cy = data.ball.cy * ratio;
      data.ball.vx = data.ball.vx * vxratio;
      // data.ball.vy = data.ball.vy * ratio;
      ball = {
        ...ball,
        ...data.ball,
      }
      // if (data.pH)
      //   pHost.paddle?.cy(data.pH);
      // if (data.pG)
      //   pGuest.paddle?.cy(data.pG);
    });
    socket.on('ballVel', (data:{reset: Boolean, ball: Ball}) => {
      console.log("received ballVel ", data.ball.vx, "  ", data.ball.vy);
      console.log("received ballpos ", data.ball.cx, "  ", data.ball.cy);
      if (data.reset)
      {
        console.log("reseting ball");
        if (data.ball.vx < 0)
          data.ball.cx = width - paddleWidth - (ballSize / 2);
        else
          data.ball.cx = paddleWidth + (ballSize / 2);
        ball.cercle?.center(data.ball.cx, data.ball.cy)
      }
      else
        data.ball.cx = data.ball.cx * ratio;
      // if (data.reset)
      // {
      //   if (data.ball.vx < 0)
      //     data.ball.cx = width - paddleWidth - (ballSize / 2);
      //   else
      //     data.ball.cx = paddleWidth + (ballSize / 2);
      // }
      // data.ball.cy = data.ball.cy * ratio;
      data.ball.vx = data.ball.vx * vxratio;
      // data.ball.vy = data.ball.vy * ratio;
      ball = {
        ...ball,
        ...data.ball,
      }
      // ball.vx = data.ball.vx;
      // ball.vy = data.ball.vy;
      // ball.cx = data.ball.cx;
      ball.cercle?.cy(data.ball.cy);
      console.log("ballpos ", ball.cx  / ratio, "  ", ball.cy);
    });
    
    function update(dt: number) {
      if (ball.vx === 0 && ball.vy === 0)
        return;
      ball.cercle.dmove(ball.vx*dt, ball.vy*dt)
      ball.cx = ball.cercle.cx()
      , ball.cy = ball.cercle.cy()
      // var distance = Math.sqrt(Math.pow(mouseX - ball.cx, 2) + Math.pow(mouseY - ball.cy, 2));
      if ((ball.vy < 0 && ball.cy - (ballSize / 2)  <= 0) || (ball.vy > 0 && ball.cy + (ballSize / 2)  >= height)) {
        socket.emit('moveBall', { ball: { vx: ball.vx / vxratio, vy: -ball.vy, cx: ball.cx  / ratio , cy: ball.cy}, action: "up", userId: pHost.user_id });
      } else {
        var paddleRightY: number = 0;
        if (pGuest && pGuest.paddle) {
          paddleRightY = parseInt(pGuest.paddle.y().valueOf().toString());
        }
        var paddleLeftY: number = 0;
        if (pHost && pHost.paddle) {
          paddleLeftY = parseInt(pHost.paddle.y().valueOf().toString());
        }
        if ((ball.vx < 0 && ball.cx - ((ballSize / 2)) <= paddleWidth && ball.cy + (ballSize / 2)  > paddleLeftY && ball.cy - (ballSize / 2)  < paddleLeftY + paddleHeight) ||
        (ball.vx > 0 && ball.cx + ((ballSize / 2)) >= width - paddleWidth && ball.cy + (ballSize / 2)  > paddleRightY && ball.cy - (ballSize / 2)  < paddleRightY + paddleHeight)) {
          socket.emit('moveBall', { ball: { vx: - (ball.vx / vxratio) * 1.05,  vy: (ball.cy - ((ball.vx < 0 ? paddleLeftY : paddleRightY) + paddleHeight/2)) * 7 , cx: 0, cy: ball.cy}, action: "paddle", userId: pHost.user_id});
        }
        else if ((ball.vx < 0 && ball.cx - ((ballSize / 2)) <= 0) || (ball.vx > 0 && ball.cx + ((ballSize / 2)) >= width)) {
          if (ball.vx < 0) {
            reset(pGuest.score+1, pHost.score, width, height, socket, pHost, pGuest) }
          else { 
            reset(pGuest.score, pHost.score+1, width, height, socket, pHost, pGuest) }
        }
          // if (ball.vx < 0) {
          //   reset(pGuest.score+1, pHost.score, width, height, socket, pHost, pGuest) }
          // else { 
          //   reset(pGuest.score, pHost.score+1, width, height, socket, pHost, pGuest) }
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
    
    const cleanup = () => {
        draw.clear();
        draw.remove();
        socket.off('move');
        socket.off('start');
        socket.off('reset');
        socket.off('ballVel');
        socket.off('updateFrame');
        socket.off('getFrame');
        socket.off('keydown');
        socket.off('keyup');
        socket.off('done');
        socket.off('winByAbort');
        cancelAnimationFrame(animFrame);
      }
      
      return cleanup;
  };