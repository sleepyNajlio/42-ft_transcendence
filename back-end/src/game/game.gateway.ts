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
  namespace: '/',
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
  private userSockets: { [userId: string]: any[] } = {};
  constructor(private readonly socketGateway: SocketGateway) {}

  async handleConnection() {}

  handleDisconnect() {
    // this.logger.log(`Client ${client.id} disconnected from game.`);
    // // If the player is in a game, end the game and notify the other player
    // for (const gameId in this.games) {
    //   const game = this.games[gameId];
    //   if (game.players[client.id]) {
    //     const otherPlayerId = Object.keys(game.players).find(
    //       (id) => id !== client.id,
    //     );
    //     if (otherPlayerId) {
    //       // Emit the 'opponentDisconnected' event to the other player
    //       // Emit the 'opponentDisconnected' event to the other player
    //       this.socketGateway
    //         .getServer()
    //         .of('/events')
    //         .to(gameId)
    //         .emit('opponentDisconnected', gameId);
    //     }
    //     // Remove the player from the game room
    //     client.leave(gameId);
    //     delete this.games[gameId];
    //   }
    // }
    // // Remove the player from the queue
    // const index = this.queue.indexOf(client);
    // if (index !== -1) {
    //   this.queue.splice(index, 1);
    // }
    // delete this.players[client.id];
    // this.logger.log(`Client ${client.id} disconnected from game.`);
  }

  @SubscribeMessage('matchmaking')
  handleJoinQueue(client: any) {
    // Check if the user is already in the queue based on a unique identifier (e.g., user ID)
    const userId = getUserIdFromClient(client);

    // Check if the user is already in the queue
    if (!(userId in this.userSockets)) {
      // If not, create a new entry in the mapping
      this.userSockets[userId] = [];
    }

    // Add the new socket to the array of sockets for this user
    this.userSockets[userId].push(client);

    // If the user is not already in the queue, add them
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
      // Check if the userSockets entry for player1 is defined before calling forEach
      if (this.userSockets[player1.id]) {
        this.userSockets[player1.id].forEach((socket) => socket.join(gameId));
      } else {
        this.logger.log(`userSockets ${player1.id} is undefined.`);
      }

      // Check if the userSockets entry for player2 is defined before calling forEach
      if (this.userSockets[player2.id]) {
        this.userSockets[player2.id].forEach((socket) => socket.join(gameId));
      } else {
        this.logger.log(`userSockets ${player1.id} is undefined.`);
      }

      this.logger.log(`game ${gameId} is created.`);

      // Emit an event to the two players to start the game
      this.socketGateway.getServer().to(gameId).emit('startGame', {
        players: this.games[gameId].players,
        bball: this.games[gameId].ball,
      });
    }
  }

  @SubscribeMessage('invite')
  handelInvite(client: any, data: any) {
    this.logger.log(`client ${client.id} invite ${data.player_id}`);
    // const socket = this.socketGateway.getClientSocket(data.player_id);
    // if (socket) {
    //   console.log('Sending invite to:', data.player_id);
    // socket.emit('Invited', data);
    // }
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
        this.socketGateway.getServer().to(gameId).emit('reset', {
          ball: this.games[gameId].ball,
          playerLeft: data.playerLeft,
          playerRight: data.playerRight,
        });
      } else if (data.action === 'start') {
        // Emit the 'start' event to players in the game to start the game
        this.socketGateway
          .getServer()

          .to(gameId)
          .emit('start', { ball: this.games[gameId].ball });
      } else {
        // Emit the 'ballVel' event to players in the game to update the ball
        this.socketGateway
          .getServer()

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

        .to(gameId)
        .emit('pong', data); // Emit message to all connected clients
    }
    this.socketGateway.getServer().emit('pong', data); // Emit message to all connected clients
  }
}
// Helper function to extract the user ID from the client
function getUserIdFromClient(client: any): string | null {
  // Assuming the user ID is passed as a query parameter during the socket connection
  const userId = client.handshake.query.userId;

  // Return the extracted user ID or null if not present
  return userId || null;
}
