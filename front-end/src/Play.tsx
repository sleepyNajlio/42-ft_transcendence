import { useEffect } from 'react';
import Navbar from './Components/Navbar.tsx';
import Sbox from './Components/Sbox.tsx';
import  './styles/css/main.css'
import { SVG, on } from '@svgdotjs/svg.js';
// import {pod1} from './assets/g2.svg';
// import {pod2} from './assets/g3.svg';

export function Play() {
    useEffect(() => {
        var width = 800, height = 600

        // create SVG game board
        var draw = SVG().addTo('#pong').size(width, height).attr({ fill: '#f06' })

        // Add a rectangle element to the SVG with the same size as the SVG and set its fill color to the desired background color
        draw.rect(width, height).fill('#f09').radius(20)

        var paddleWidth = 20, paddleHeight = 100
        var paddleLeft = draw.rect(paddleWidth, paddleHeight)
        paddleLeft.x(0).cy(height/2).fill('#00ff99')

        var paddleRight = draw.rect(paddleWidth, paddleHeight)
        
        paddleRight.x(width - paddleWidth).cy(height/2).fill('#39ff14')
        var ballSize = 20
        var ball = draw.circle(ballSize)
        ball.center(width/2, height/2).fill('#ff69b4')

        // game logic
        //var difficulty = 2
        var difficulty = 6
        var vx = Math.random() * 500 - 250
        , vy = Math.random() * 500 - 250
        
        // define initial player score
        var playerLeft = 0
        var playerRight = 0

        // create text for the score, set font properties
        var scoreLeft : any
        scoreLeft = draw.text(playerLeft+'').font({
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
        scoreRight = draw.text(playerRight+'').font({
        size: 32,
        family: 'Menlo, sans-serif',
        anchor: 'end',
        fill: '#fff'
        }).move(width/2+20, 10)
        
        // update is called on every animation step
        function update(dt: number) {
            // move the ball by its velocity
            ball.dmove(vx*dt, vy*dt)

            // get position of ball
            var cx = ball.cx()
                , cy = ball.cy()

            // check if we hit top/bottom borders
            if ((vy < 0 && cy <= 0) || (vy > 0 && cy >= height)) {
                vy = -vy
            }

            // check if a player missed the ball
            if ((vx < 0 && cx <= 0) || (vx > 0 && cx >= width)) {
                // when x-velocity is negative, its a point for player 2, else player 1
                if (vx < 0) {
                ++playerRight
                } else {
                ++playerLeft
                }
            
                // update score
                scoreLeft.text(playerLeft)
                scoreRight.text(playerRight)
            
                reset()
            }

            if (playerRight === 3 || playerLeft === 3) {
                reset()
                // Remove the ball from the SVG
                ball.remove();
                var end : any
                end = draw.text('Game over').font({
                size: 32,
                family: 'Menlo, sans-serif',
                anchor: 'end',
                fill: '#fff'
                }).center(width/2, height/2)
                
            }

            var paddleLeftY: number = parseInt(paddleLeft.y().valueOf().toString());
            var paddleRightY: number = parseInt(paddleRight.y().valueOf().toString());
            // check if we hit the paddle
            if ((vx < 0 && cx <= paddleWidth && cy > paddleLeftY && cy < paddleLeftY + paddleHeight) ||
            (vx > 0 && cx >= width - paddleWidth && cy > paddleRightY && cy < paddleRightY + paddleHeight)) {
            // depending on where the ball hit we adjust y velocity
            // for more realistic control we would need a bit more math here
            // just keep it simple
            vy = (cy - ((vx < 0 ? paddleLeftY : paddleRightY) + paddleHeight/2)) * 7 // magic factor

            // make the ball faster on hit
            vx = -vx * 1.05
            }
            var playerPaddleY = paddleRight.y();

            if (typeof playerPaddleY === 'number') {
                if (playerPaddleY <= 0 && paddleDirection === -1) {
                    paddleRight.cy(paddleHeight / 2)
                } else if (playerPaddleY >= height - paddleHeight && paddleDirection === 1) {
                    paddleRight.y(height - paddleHeight)
                } else {
                    paddleRight.dy(paddleDirection * paddleSpeed)
                }
            }
            // get position of ball and paddle
            var paddleRightCy = paddleLeft.cy()

            // move the left paddle in the direction of the ball
            var dy = Math.min(difficulty, Math.abs(cy - paddleRightCy))
            paddleRightCy += cy > paddleRightCy ? dy : -dy

            // constraint the move to the canvas area
            paddleLeft.cy(Math.max(paddleHeight/2, Math.min(height-paddleHeight/2, paddleRightCy)))
        }

        var lastTime: number | undefined, animFrame;

        function callback(ms: number) {
            // we get passed a timestamp in milliseconds
            // we use it to determine how much time has passed since the last call

            if (lastTime) {
                update((ms-lastTime)/500) // call update and pass delta time in seconds
            }
            
            lastTime = ms
            animFrame = requestAnimationFrame(callback)
        }

        callback(100)

        // define paddle direction and speed
        var paddleDirection = 0  // -1 is up, 1 is down, 0 is still
        , paddleSpeed = 5      // pixels per frame refresh

        // detect if up and down arrows are prssed to change direction
        on(document, 'keydown', function(e : any) {
            paddleDirection = e.keyCode == 40 ? 1 : e.keyCode == 38 ? -1 : 0
        });

        // make sure the direction is reset when the key is released
        on(document, 'keyup', function(e) {
            paddleDirection = 0
        })
        function reset() {
            // reset speed values
            vx = 0
            vy = 0
          
            // position the ball back in the middle
            ball.animate(100).center(width / 2, height / 2)
          
            // reset the position of the paddles
            paddleLeft.animate(100).cy(height / 2)
            paddleRight.animate(100).cy(height / 2)
        }
        draw.on('click', function() {
            if (vx === 0 && vy === 0) {
              vx = Math.random() * 500 - 250
              vy = Math.random() * 500 - 250
            }
        })

        
        // Cleanup function
        return () => {
          // You can perform cleanup here if needed
          draw.clear();
          draw.remove();
        };
      }, []); // Empty dependency array means the effect runs once after initial render
    
    return (
        <>
            <Navbar></Navbar>
            {/* <Sbox btitle="Play" stitle="Goat pong" lb="Play with friend" rb="Matchmaking"></Sbox> */}
            <div className="game_container" id="game_container">
                <div className="pong" id="pong">
                </div>
            </div>
        </>
    )
}