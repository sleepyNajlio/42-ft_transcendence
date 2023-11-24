import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
// import { Socket } from 'socket.io';
import { Socket } from 'socket.io-client';
import { Circle } from '@svgdotjs/svg.js';

@WebSocketGateway({
  namespace: 'events',
  cors: '*:*',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private players: { [key: string]: any } = {}; // Define the type of players object
  private Ball: {
    cx: number;
    cy: number;
    cercle: Circle;
    vx: number;
    vy: number;
  } = {
    cx: 300,
    cy: 300,
    cercle: null,
    vx: 0,
    vy: 0,
  };
  private readonly logger = new Logger(GameGateway.name);

  private initBall() {
    this.Ball.cercle = null;
    this.Ball.cx = 300;
    this.Ball.cy = 300;
    this.Ball.vx = 0;
    this.Ball.vy = 0;
  }

  @WebSocketServer()
  private server: Socket;

  handleConnection(client: any, ...args: any[]) {
    this.players[client.id] = {
      s_id: client.id,
      host: false,
      x: 0,
      y: 0,
      paddleDirection: 0,
      paddle: null,
      paddleSpeed: 5,
    };
    if (Object.keys(this.players).length === 1)
      this.players[client.id].host = true;
    if (Object.keys(this.players).length === 2) {
      this.players[client.id].host = false;
      this.initBall();
    }
    this.logger.log(this.players);
    if (Object.keys(this.players).length === 2) {
      this.logger.log('Game is full');
      this.server.emit('currentPlayers', this.players, this.Ball);
    }
    this.logger.log(`Client ${client.id} connected on game.`);
  }

  handleDisconnect(client: any) {
    delete this.players[client.id];
    this.logger.log(`Client ${client.id} disconnected from game.`);
  }

  @SubscribeMessage('keydown')
  handelKeyDown(client: any, data: any) {
    this.logger.log(`client ${client.id} moved to ${data.paddleDirection}`);
    this.server.emit('move', data); // Emit message to all connected clients
  }
  @SubscribeMessage('keyup')
  handelKeyUp(client: any, data: any) {
    this.logger.log(`client ${client.id} moved to ${data.paddleDirection}`);
    this.server.emit('move', data); // Emit message to all connected clients
  }

  @SubscribeMessage('moveBall')
  handleMoveBall(client: any, data: { vx: number; vy: number }) {
    client.broadcast.emit('ballVel', data);
  }
  @SubscribeMessage('ping')
  handleMessage(client: any, data: any) {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${data}`);
    this.server.emit('pong', data); // Emit message to all connected clients
  }
}
