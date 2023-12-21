import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SocketGateway } from 'src/socket/socket.gateway';
import axios from 'axios';
import { Player } from '@prisma/client';

interface Ball {
  cx: number;
  cy: number;
  vx: number;
  vy: number;
}
enum PlayerState {
  PLAYING = 'PLAYING',
  SEARCHING = 'SEARCHING',
  INVITING = 'INVITING',
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

  private queue: { userId: string; socket: Socket }[] = [];
  private games: {
    [id: string]: {
      players: { [key: string]: any };
      ball: Ball;
    };
  } = {};
  private notifs: { [key: string]: Player[] } = {};

  constructor(private readonly socketGateway: SocketGateway) {}

  async handleConnection() {}

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected from game`);

    const userId = getUserIdFromClient('disconnect', client);
    if (!userId || !this.players[userId]) {
      return;
    }
    // Check if the socket is in the queue
    const playerState = this.players[userId].state;
    const cookies = client.handshake.auth.sessionCookies;
    if (playerState === PlayerState.SEARCHING) {
      const queue = this.queue.find((c) => c.userId === userId);
      console.log('abort in queue');
      // Socket is in the queue
      // Remove the socket from the queue
      this.queue.splice(this.queue.indexOf(queue), 1);
      // Remove usergame from database
      // Remove game from database
      axios
        .delete(`http://localhost:3000/game/${userId}/deletegame/SEARCHING`, {
          headers: {
            Cookie: cookies,
          },
        })
        .then(() => {
          console.log('deleted');
        })
        .catch((err) => {
          console.log('err: ', err);
        });
      this.socketGateway.getClientSocket(userId)?.map((socketa) => {
        if (socketa.id !== client.id) socketa.emit('InitializeGame');
      });
      // delete this.players[userId];
      delete this.players[userId];
    } else if (playerState === PlayerState.INVITING) {
      console.log('abort in invite');
      axios
        .delete(`http://localhost:3000/game/${userId}/deletegame/SEARCHING`, {
          headers: {
            Cookie: cookies,
          },
        })
        .then(() => {
          console.log('deleted');
        })
        .catch((err) => {
          console.log('err: ', err);
        });
      this.socketGateway.getClientSocket(userId)?.map((socketa) => {
        if (socketa.id !== client.id) socketa.emit('InitializeGame');
      });
      delete this.players[userId];
    } else if (playerState === PlayerState.PLAYING) {
      console.log('abort in game');
      // Socket is not in the queue, check if it is in a game
      const gameId = Object.keys(this.games).find(
        (id) => this.games[id].players[userId],
      );

      if (gameId) {
        //   // Socket is in a game
        const game = this.games[gameId];
        // update game abort
        // update usergame lose
        // update opponent usergame win
        axios
          .get(`http://localhost:3000/game/${userId}/getgame/PLAYING`, {
            headers: {
              Cookie: cookies,
            },
          })
          .then((res) => {
            const dbgameId = res.data.id_game;
            axios
              .post(
                `http://localhost:3000/game/${dbgameId}/updateGame`,
                {
                  status: 'ABORTED',
                },
                {
                  headers: {
                    Cookie: cookies,
                  },
                },
              )
              .then(() => {
                console.log('updated game');
              })
              .catch((err) => {
                console.log('err: ', err);
              });
            const opponentId = Object.keys(game.players).find(
              (id) => id !== userId,
            );
            axios
              .post(
                `http://localhost:3000/game/${dbgameId}/${userId}/updateUserGame`,
                {
                  win: 0,
                },
                {
                  headers: {
                    Cookie: cookies,
                  },
                },
              )
              .then(() => {
                console.log('updated player');
              })
              .catch((err) => {
                console.log('err: ', err);
              });
            axios
              .post(
                `http://localhost:3000/game/${dbgameId}/${opponentId}/updateUserGame`,
                {
                  win: 1,
                },
                {
                  headers: {
                    Cookie: cookies,
                  },
                },
              )
              .then(() => {
                console.log('updated opponent');
              })
              .catch((err) => {
                console.log('err: ', err);
              });
            // Warn all the players sockets in the game
            this.socketGateway.getClientSocket(userId)?.map((socketa) => {
              if (socketa.id !== client.id) {
                socketa.emit('InitializeGame');
                socketa.leave(gameId);
              }
            });
            this.socketGateway.getClientSocket(opponentId)?.map((socketa) => {
              if (socketa.id !== client.id) {
                socketa.emit('winByAbort');
                socketa.leave(gameId);
              }
            });
            delete this.players[userId];
            delete this.players[opponentId];
          })
          .catch((err) => {
            console.log('err: ', err);
          });
        // remove the game from this.games
        delete this.games[gameId];
      }
    }
  }

  @SubscribeMessage('matchmaking')
  handleJoinQueue(client: Socket) {
    // Check if the user is already in the queue based on a unique identifier (e.g., user ID)
    // const userId = getUserIdFromClient('matchmaking', client); // Implement a function to extract the user ID

    // If the user is not already in the queue, add them
    const userId = getUserIdFromClient('matchmaking', client);
    const isUserInQueue = this.queue.find((c) => c.userId === userId);

    if (!isUserInQueue) {
      // Add the player to the queue
      // Initialize the player state
      this.queue.push({ userId, socket: client });
      // Initialize the player state
      this.players[userId] = {
        s_id: client.id,
        user_id: userId,
        host: false,
        x: 0,
        y: 0,
        paddleDirection: 0,
        paddle: null,
        paddleSpeed: 5,
        state: PlayerState.SEARCHING,
      };
      this.socketGateway.getClientSocket(userId)?.map((socketa) => {
        if (socketa.id !== client.id) socketa.emit('alreadyInQueue');
      });
    }
    // If there are at least two players in the queue, start a new game
    if (this.queue.length >= 2) {
      const player1 = this.queue.shift();
      const player2 = this.queue.shift();
      // Create a unique game ID
      const gameId = `${player1.socket.id}-${player2.socket.id}`;
      console.log('gameId', gameId);
      this.players[player1.userId].state = PlayerState.PLAYING;
      this.players[player2.userId].state = PlayerState.PLAYING;
      // Initialize the game state
      this.games[gameId] = {
        players: {
          [player1.userId]: this.players[player1.userId],
          [player2.userId]: this.players[player2.userId],
        },
        ball: this.ball,
      };

      this.games[gameId].players[player1.userId].host = true;
      // Add the players to the game room
      this.socketGateway.getClientSocket(player1.userId)?.map((socketa) => {
        socketa.join(gameId);
      });
      this.socketGateway.getClientSocket(player2.userId)?.map((socketa) => {
        socketa.join(gameId);
      });
      this.logger.log(`game ${gameId} is created.`);

      this.socketGateway.getServer().to(gameId).emit('startGame', {
        players: this.games[gameId].players,
        bball: this.games[gameId].ball,
      });
      return { id: player1.userId == userId ? player2.userId : player1.userId };
    } else return { id: null };
  }

  @SubscribeMessage('invite')
  handelInvite(client: Socket, data: any) {
    console.log('invite to ', data.adv_id, ' by ', data.userId);
    this.players[data.userId] = {
      s_id: client.id,
      user_id: data.userId,
      username: data.username,
      host: false,
      x: 0,
      y: 0,
      paddleDirection: 0,
      paddle: null,
      paddleSpeed: 5,
      state: PlayerState.INVITING,
    };
    if (!this.notifs[data.adv_id]) {
      this.notifs[data.adv_id] = [];
    }
    this.notifs[data.adv_id] = [
      ...this.notifs[data.adv_id],
      this.players[data.userId],
    ];
    this.logger.log(`emiting invite`);
    this.logger.log(this.notifs);
    this.socketGateway.getClientSocket(data.adv_id).map((socketa) => {
      socketa.emit('invited', this.players[data.userId]);
    });
  }

  @SubscribeMessage('inviteResp')
  handelInviteResp(client: Socket, data: any) {
    if (data.accepted) {
      if (!this.players[data.userId]) {
        this.socketGateway.getClientSocket(data.adv_id).map((socketa) => {
          socketa.emit('rejected', data.adv_id);
        });
        return false;
      }
      this.players[data.adv_id] = {
        s_id: client.id,
        user_id: data.adv_id,
        username: data.username,
        host: false,
        x: 0,
        y: 0,
        paddleDirection: 0,
        paddle: null,
        paddleSpeed: 5,
        state: PlayerState.PLAYING,
      };
      this.players[data.userId].state = PlayerState.PLAYING;
      const gameId = `${this.players[data.userId].s_id}-${
        this.players[data.adv_id].s_id
      }`;
      // Initialize the game state
      this.games[gameId] = {
        players: {
          [data.userId]: this.players[data.userId],
          [data.adv_id]: this.players[data.adv_id],
        },
        ball: this.ball,
      };
      this.games[gameId].players[data.adv_id].host = true;
      // Add the players to the game room
      this.socketGateway.getClientSocket(data.userId).map((socketa) => {
        socketa.join(gameId);
      });
      this.socketGateway.getClientSocket(data.adv_id).map((socketa) => {
        socketa.join(gameId);
      });
      this.logger.log(`game ${gameId} is created.`);

      this.socketGateway.getServer().to(gameId).emit('startGame', {
        players: this.games[gameId].players,
        bball: this.games[gameId].ball,
      });
      return true;
    } else {
      this.socketGateway.getClientSocket(data.adv_id).map((socketa) => {
        socketa.emit('rejected', data.adv_id);
      });
      return false;
    }
  }

  @SubscribeMessage('keydown')
  handelKeyDown(client: Socket, data: any) {
    const gameId = Object.keys(this.games).find(
      (id) => this.games[id].players[data.userId],
    );

    this.logger.log(`emiting move ${gameId} ${data.userId}`);
    if (gameId) {
      this.games[gameId].ball = {
        ...this.games[gameId].ball,
        ...data.ball,
      };
      this.logger.log(`emiting move again ${gameId} ${data.userId}`);
      // Emit the 'move' event to the other player in the game
      this.socketGateway.getServer().to(gameId).emit('move', data);
    }
  }

  @SubscribeMessage('getNotifs')
  getNotifs(client: Socket) {
    this.logger.log(`getNotifs ${client.id}---- `);
    this.logger.log(this.notifs);

    const userId = getUserIdFromClient('getNotifs', client);
    if (userId) {
      const notifs = this.notifs[userId];
      return notifs ? notifs : [];
    }
    return null;
  }

  // a player receives multiple notifs invites
  // he sees them, but when he refreshes call getNotifs again and he sees them again
  // but if we delete them from notifs, he will not see them again
  // so we need to delete them from notifs when he accepts or rejects them
  @SubscribeMessage('deleteNotifs')
  deleteNotifs(client: Socket) {
    this.logger.log(`deleteNotifs ${client.id}`);
    const userId = getUserIdFromClient('deleteNotifs', client);
    if (userId) {
      delete this.notifs[userId];
    }
  }

  @SubscribeMessage('keyup')
  handelKeyUp(client: Socket, data: any) {
    const gameId = Object.keys(this.games).find(
      (id) => this.games[id].players[data.userId],
    );
    this.logger.log(`emiting move ${gameId} ${data.userId}`);

    if (gameId) {
      this.games[gameId].ball = {
        ...this.games[gameId].ball,
        ...data.ball,
      };
      this.logger.log(`emiting move again ${gameId} ${data.userId}`);
      // Emit the 'move' event to the other player in the gam
      this.socketGateway.getServer().to(gameId).emit('move', data);
    }
  }

  @SubscribeMessage('moveBall')
  handleMoveBall(
    client: Socket,
    data: {
      ball: { vx: number; vy: number; cx: number; cy: number };
      action: string;
      playerLeft: number;
      playerRight: number;
      userId: string;
    },
  ) {
    const gameId = Object.keys(this.games).find(
      (id) => this.games[id].players[data.userId],
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
  handleVisible(client: Socket, data: any) {
    // const userId = getUserIdFromClient('documentVisible', client);

    this.logger.log(`documentVisible message`);
    // Find the game that the player is in
    const gameId = Object.keys(this.games).find(
      (id) => this.games[id].players[data.userId],
    );

    if (gameId) {
      // playeer is already in game
      client.to(gameId).emit('getFrame', data);
    }
  }

  @SubscribeMessage('playOpen')
  async handlePlayOpen(client: Socket) {
    // Extract the user ID from the client
    console.log('playOpen');
    const gameId = Object.keys(this.games).find(
      (id) => this.games[id].players[client.id],
    );

    if (gameId) {
      console.log('is in game');
      // Add the new socket to the game room
      client.join(gameId);
      // playeer is already in game
      client.emit('startGame', {
        players: this.games[gameId].players,
        bball: this.games[gameId].ball,
      });
    } else {
      console.log('is not in game');
    }
  }

  @SubscribeMessage('paddlePos')
  handlePaddlePos(
    client: Socket,
    data: {
      y1: number;
      y2: number;
      playerLeft: number;
      playerRight: number;
      ball: Ball;
      userId: string;
    },
  ) {
    const gameId = Object.keys(this.games).find(
      (id) => this.games[id].players[data.userId],
    );
    this.logger.log(`emiting updateFrame`);
    if (gameId) {
      this.games[gameId].ball = {
        ...this.games[gameId].ball,
        ...data.ball,
      };
      // Emit the 'move' event to the other player in the game
      this.socketGateway.getServer().to(gameId).emit('updateFrame', {
        ball: this.games[gameId].ball,
        y1: data.y1,
        y2: data.y2,
        playerLeft: data.playerLeft,
        playerRight: data.playerRight,
        id: data.userId,
      });
    }
  }
}
// Helper function to extract the user ID from the client
function getUserIdFromClient(fun: string, client: Socket): string | null {
  // Assuming the user ID is passed as a query parameter during the socket connection
  const userId = client.handshake.query.userId;
  if (Array.isArray(userId)) {
    throw new Error('userId must be a string, not an array');
  }
  Logger.log(`${fun} Client ${client.id} connected. ${userId}}`);
  // this.socketGateway.getUserIdFromClient(client);

  // Return the extracted user ID or null if not present
  return userId || null;
}
