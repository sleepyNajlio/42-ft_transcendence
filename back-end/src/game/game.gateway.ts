import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
// import { Socket } from 'socket.io';
import { SocketGateway } from 'src/socket/socket.gateway';

interface Ball {
  cx: number;
  cy: number;
  vx: number;
  vy: number;
}

@WebSocketGateway({
  namespace: 'events',
  cors: '*:*',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private players: { [key: string]: any } = {}; // Define the type of players object
  private ball: Ball = {
    cx: 300,
    cy: 300,
    vx: 0,
    vy: 0,
  };
  private readonly logger = new Logger(GameGateway.name);

  private queue: any[] = [];
  private games: {
    [id: string]: {
      players: { [key: string]: any };
      ball: Ball;
    };
  } = {};

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
        ball: this.ball,
      };

      this.games[gameId].players[player1.id].host = true;
      // Add the players to the game room
      player1.join(gameId);
      player2.join(gameId);
      this.logger.log(`game ${gameId} is created.`);

      // Emit an event to the two players to start the game
      console.log('ball', this.games[gameId].ball);
      this.socketGateway.getServer().of('/events').emit('startGame', {
        players: this.games[gameId].players,
        bball: this.games[gameId].ball,
      });
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
      this.games[gameId].ball = {
        ...this.games[gameId].ball,
        ...data.ball,
      };
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
      this.games[gameId].ball = {
        ...this.games[gameId].ball,
        ...data.ball,
      };
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
    data: {
      ball: { vx: number; vy: number; cx: number; cy: number };
      action: string;
      playerLeft: number;
      playerRight: number;
    },
  ) {
    // Find the game that the player is in
    const gameId = Object.keys(this.games).find(
      (id) => this.games[id].players[client.id],
    );
    if (gameId) {
      this.games[gameId].ball = {
        ...this.games[gameId].ball,
        ...data.ball,
      };
      if (data.action === 'reset') {
        this.games[gameId].ball = {
          ...this.games[gameId].ball,
          ...{ cx: 300, cy: 300, vx: 0, vy: 0 },
        };
        // Emit the 'reset' event to players in the game to reset the game
        this.socketGateway.getServer().of('/events').to(gameId).emit('reset', {
          ball: this.games[gameId].ball,
          playerLeft: data.playerLeft,
          playerRight: data.playerRight,
        });
      } else if (data.action === 'start') {
        // Emit the 'start' event to players in the game to start the game
        this.socketGateway
          .getServer()
          .of('/events')
          .to(gameId)
          .emit('start', { ball: this.games[gameId].ball });
      } else {
        // Emit the 'ballVel' event to players in the game to update the ball
        this.socketGateway
          .getServer()
          .of('/events')
          .to(gameId)
          .emit('ballVel', { ball: this.games[gameId].ball });
      }
    }
  }

  @SubscribeMessage('documentVisible')
  handleVisible(client: any, data: any) {
    // Find the game that the player is in
    const gameId = Object.keys(this.games).find(
      (id) => this.games[id].players[client.id],
    );
    if (gameId) {
      this.logger.log(
        `client ${client.id} visible Document  ${this.games[gameId].ball.cx} ${this.games[gameId].ball.cy}`,
      );
      client.broadcast.emit('getFrame', data);
    }
  }

  @SubscribeMessage('paddlePos')
  handlePaddlePos(
    client: any,
    data: { y: number; playerLeft: number; playerRight: number; ball: Ball },
  ) {
    // Find the game that the player is in

    const gameId = Object.keys(this.games).find(
      (id) => this.games[id].players[client.id],
    );
    if (gameId) {
      this.games[gameId].ball = {
        ...this.games[gameId].ball,
        ...data.ball,
      };
      // Emit the 'move' event to the other player in the game
      this.socketGateway
        .getServer()
        .of('/events')
        .to(gameId)
        .emit('updateFrame', {
          ball: this.games[gameId].ball,
          y: data.y,
          playerLeft: data.playerLeft,
          playerRight: data.playerRight,
          id: client.id,
        });
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
