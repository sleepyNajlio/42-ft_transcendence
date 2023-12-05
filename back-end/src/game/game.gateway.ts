import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
// import { Socket } from 'socket.io';
import { Circle } from '@svgdotjs/svg.js';
import { SocketGateway } from 'src/socket/socket.gateway';

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
  private queue: any[] = [];
  private games: { [id: string]: any } = {};

  constructor(private readonly socketGateway: SocketGateway) {}

  async handleConnection(client: any, ...args: any[]) {
    this.logger.log(`Client ${client.id} is connect to game.`);

    // Add the player to the queue
    this.queue.push(client);
    // Initialize the player state
    this.players[client.id] = {
      s_id: client.id,
      host: false,
      x: 0,
      y: 0,
      paddleDirection: 0,
      paddle: null,
      paddleSpeed: 5,
    };
    // If there are at least two players in the queue, start a new game
    if (this.queue.length >= 2) {
      const player1 = this.queue.shift();
      const player2 = this.queue.shift();

      // Create a unique game ID
      const gameId = `${player1.id}-${player2.id}`;

      // Initialize the game state
      this.games[gameId] = {
        players: {
          [player1.id]: this.players[player1.id],
          [player2.id]: this.players[player2.id],
        },
        ball: this.Ball,
      };

      this.games[gameId].players[player1.id].host = true;
      // Add the players to the game room
      player1.join(gameId);
      player2.join(gameId);
      this.logger.log(`game ${gameId} is created.`);

      // Emit an event to the two players to start the game
      this.socketGateway
        .getServer()
        .of('/events')
        .emit('startGame', this.games[gameId]);
    }
  }

  handleDisconnect(client: any) {
    this.logger.log(`Client ${client.id} disconnected from game.`);

    // If the player is in a game, end the game and notify the other player
    for (const gameId in this.games) {
      const game = this.games[gameId];
      if (game.players[client.id]) {
        const otherPlayerId = Object.keys(game.players).find(
          (id) => id !== client.id,
        );
        if (otherPlayerId) {
          // Emit the 'opponentDisconnected' event to the other player
          // Emit the 'opponentDisconnected' event to the other player
          this.socketGateway
            .getServer()
            .of('/events')
            .to(gameId)
            .emit('opponentDisconnected', gameId);
        }
        // Remove the player from the game room
        client.leave(gameId);

        delete this.games[gameId];
      }
    }
    // Remove the player from the queue
    const index = this.queue.indexOf(client);
    if (index !== -1) {
      this.queue.splice(index, 1);
    }

    delete this.players[client.id];

    this.logger.log(`Client ${client.id} disconnected from game.`);
  }

  @SubscribeMessage('invite')
  handelInvite(client: any, data: any) {
    this.logger.log(`client ${client.id} invite ${data.player_id}`);
    const socket = this.socketGateway.getClientSocket(data.player_id);
    if (socket) {
      console.log('Sending invite to:', data.player_id);
      // socket.emit('Invited', data);
    }
    // Find the player socket in the main server
    this.socketGateway.getServer().of('/').emit('inviter', data.player_id);
  }

  @SubscribeMessage('keydown')
  handelKeyDown(client: any, data: any) {
    // Find the game that the player is in
    const gameId = Object.keys(this.games).find(
      (id) => this.games[id].players[client.id],
    );

    if (gameId) {
      // Emit the 'move' event to the other player in the game
      this.socketGateway
        .getServer()
        .of('/events')
        .to(gameId)
        .emit('move', data);
    }
  }
  @SubscribeMessage('keyup')
  handelKeyUp(client: any, data: any) {
    // Find the game that the player is in
    const gameId = Object.keys(this.games).find(
      (id) => this.games[id].players[client.id],
    );
    if (gameId) {
      // Emit the 'move' event to the other player in the game
      this.socketGateway
        .getServer()
        .of('/events')
        .to(gameId)
        .emit('move', data);
    }
  }

  @SubscribeMessage('moveBall')
  handleMoveBall(
    client: any,
    data: { vx: number; vy: number; cx: number; cy: number },
  ) {
    // Find the game that the player is in
    const gameId = Object.keys(this.games).find(
      (id) => this.games[id].players[client.id],
    );
    if (gameId) {
      // Emit the 'move' event to the other player in the game
      this.socketGateway
        .getServer()
        .of('/events')
        .to(gameId)
        .emit('ballVel', data);
    }
  }

  @SubscribeMessage('documentVisible')
  handleVisible(client: any, data: any) {
    // Find the game that the player is in
    const gameId = Object.keys(this.games).find(
      (id) => this.games[id].players[client.id],
    );
    if (gameId) {
      client.broadcast.to(gameId).emit('getPaddlePos', data);
    }
  }
  @SubscribeMessage('paddlePos')
  handlePaddlePos(client: any, data: any) {
    // Find the game that the player is in

    const gameId = Object.keys(this.games).find(
      (id) => this.games[id].players[client.id],
    );
    if (gameId) {
      // Emit the 'move' event to the other player in the game
      this.socketGateway
        .getServer()
        .of('/events')
        .to(gameId)
        .emit('updatepaddlePos', data);
    }
  }

  @SubscribeMessage('ping')
  handleMessage(client: any, data: any) {
    // Find the game that the player is in
    const gameId = Object.keys(this.games).find(
      (id) => this.games[id].players[client.id],
    );
    if (gameId) {
      // Emit the 'move' event to the other player in the game
      this.socketGateway
        .getServer()
        .of('/events')
        .to(gameId)
        .emit('pong', data); // Emit message to all connected clients
    }
    this.socketGateway.getServer().of('/events').emit('pong', data); // Emit message to all connected clients
  }
}
