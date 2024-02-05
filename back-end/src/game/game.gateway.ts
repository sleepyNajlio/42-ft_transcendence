import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SocketGateway } from 'src/socket/socket.gateway';
import { GameService } from './game.service';
import { ConfigService } from '@nestjs/config';

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

enum NotifType {
  MESSAGE = 'MESSAGE',
  INVITE = 'INVITE',
  GAME = 'GAME',
  BLOCKED = 'BLOCKED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

enum gameStatus {
  PLAYING = 'PLAYING',
  ABORTED = 'ABORTED',
  FINISHED = 'FINISHED',
  SEARCHING = 'SEARCHING',
  NONE = 'NONE',
}

const config = new ConfigService();

@WebSocketGateway({
  namespace: '/',
  cors: {
    origin: config.get('FRONTEND_URL'),
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private players: { [key: string]: any } = {}; // Define the type of players object
  private ball: Ball = {
    cx: 0,
    cy: 0,
    vx: 0,
    vy: 0,
  };
  private readonly logger = new Logger(GameGateway.name);

  private queue: { userId: string; socket: Socket }[] = [];
  private games: {
    [id: string]: {
      players: { [key: string]: any };
      ball: Ball;
      state: gameStatus;
      update: boolean;
    };
  } = {};
  private notifs: { [key: string]: any[] } = {};

  constructor(
    private readonly socketGateway: SocketGateway,
    private readonly gameService: GameService,
  ) {}

  async handleConnection() {
    // set an interval of 20 sec to remove the notifs that exceed 20 sec
    // setInterval(() => {
    //   for (const key in this.notifs) {
    //     this.notifs[key] = this.notifs[key].filter(
    //       (notif) => notif.time === 0 || Date.now() - notif.time < 20000,
    //     );
    //     if (this.notifs[key].length === 0) {
    //       delete this.notifs[key];
    //     }
    //   }
    // }, 20000);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected from game`);

    const userId = getUserIdFromClient('disconnect', client);
    if (!userId || !this.players[userId]) {
      return;
    }
    // Check if the socket is in the queue
    const playerState = this.players[userId].state;
    if (playerState === PlayerState.SEARCHING) {
      const queue = this.queue.find((c) => c.userId === userId);
      // Remove the socket from the queue
      this.queue.splice(this.queue.indexOf(queue), 1);
      // Remove usergame from database
      // Remove game from database
      this.gameService.deleteGameByUserId(Number(userId));
      this.socketGateway.getClientSocket(userId)?.map((socketa) => {
        if (socketa.id !== client.id) socketa.emit('InitializeGame');
      });
      delete this.players[userId];
    } else if (playerState === PlayerState.INVITING) {
      // Remove usergame from database
      // Remove game from database
      this.gameService.deleteGameByUserId(Number(userId));
      this.socketGateway.getClientSocket(userId)?.map((socketa) => {
        if (socketa.id !== client.id) socketa.emit('InitializeGame');
      });
      delete this.players[userId];
      // Iterate over all keys in this.notifs
      for (const key in this.notifs) {
        // get the key that the player is inviting
        const player = this.notifs[key].find(
          (player) => player.user_id === userId,
        );
        if (!player) {
          continue;
        } else {
          // get the socket of the player from the key
          this.socketGateway.getClientSocket(key)?.map((socketa) => {
            this.logger.log('emiting rminvite', key, socketa.id);
            if (socketa.id !== client.id) socketa.emit('rminvite', userId);
          });
          // Filter out the deleted player
          this.notifs[key] = this.notifs[key].filter(
            (player) => player.user_id !== userId,
          );
          // If there are no more invites for this player, delete the key
          if (this.notifs[key].length === 0) {
            delete this.notifs[key];
          }
        }
      }
    } else if (playerState === PlayerState.PLAYING) {
      // Socket is not in the queue, check if it is in a game
      const gameId = Object.keys(this.games).find(
        (id) => this.games[id].players[userId],
      );
      if (gameId) {
        //   // Socket is in a game
        const game = this.games[gameId];
        // update game abort
        const opponentId = Object.keys(game.players).find(
          (id) => id !== userId,
        );
        const gamed = this.gameService.finishGame(
          Number(userId),
          Number(opponentId),
          3,
          0,
          gameStatus.ABORTED,
        );
        // remove the game from this.games
        this.socketGateway.updateStatus(Number(userId), 'ONLINE');
        this.socketGateway.updateStatus(Number(opponentId), 'ONLINE');
        this.socketGateway.getClientSocket(userId)?.map((socketa) => {
          if (socketa.id !== client.id) {
            socketa.emit('InitializeGame');
            socketa.leave(gameId);
          }
        });
        this.socketGateway.getClientSocket(opponentId)?.map((socketa) => {
          if (socketa.id !== client.id) {
            socketa.emit('winByAbort', { gameId: gamed });
            socketa.leave(gameId);
          }
        });
        delete this.players[userId];
        delete this.players[opponentId];
        delete this.games[gameId];
      }
    }
  }

  @SubscribeMessage('matchmaking')
  handleJoinQueue(
    client: Socket,
    data: {
      width: number;
      difficulty: number;
      padl: number;
      username: string;
      avatar: string;
    },
  ) {
    // Check if the user is already in the queue based on a unique identifier (e.g., user ID)
    // const userId = getUserIdFromClient('matchmaking', client); // Implement a function to extract the user ID
    console.log('matchmaking', data.width);
    // If the user is not already in the queue, add them
    const userId = getUserIdFromClient('matchmaking', client);
    const isUserInQueue = this.queue.find((c) => c.userId === userId);

    if (!isUserInQueue) {
      this.logger.log(`Client width is ${data.width}`);
      // Add the player to the queue
      // Initialize the player state
      this.queue.push({ userId, socket: client });
      // Initialize the player state
      this.players[userId] = {
        s_id: client.id,
        user_id: userId,
        host: false,
        avatar: data.avatar,
        width: data.width,
        paddleSpeed: 3 * data.difficulty,
        username: data.username,
        ratio: 1,
        padl: data.padl,
        vxratio: 1,
        x: 0,
        y: 0,
        paddleDirection: 0,
        paddle: null,
        score: 0,
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
      this.players[player1.userId].state = PlayerState.PLAYING;
      this.players[player2.userId].state = PlayerState.PLAYING;
      // Initialize the game state
      this.games[gameId] = {
        players: {
          [player1.userId]: this.players[player1.userId],
          [player2.userId]: this.players[player2.userId],
        },
        ball: this.ball,
        state: gameStatus.NONE,
        update: true,
      };

      this.games[gameId].players[player1.userId].host = true;
      // li 3ndo asghar width

      if (
        this.games[gameId].players[player1.userId].width <
        this.games[gameId].players[player2.userId].width
      ) {
        this.games[gameId].players[player1.userId].ratio = 1;
        this.games[gameId].players[player2.userId].ratio =
          this.games[gameId].players[player2.userId].width /
          this.games[gameId].players[player1.userId].width;
        this.games[gameId].players[player1.userId].vxratio = 1;
        this.games[gameId].players[player2.userId].vxratio =
          (this.games[gameId].players[player2.userId].width - 50) /
          (this.games[gameId].players[player1.userId].width - 50);
      } else {
        this.games[gameId].players[player2.userId].ratio = 1;
        this.games[gameId].players[player1.userId].ratio =
          this.games[gameId].players[player1.userId].width /
          this.games[gameId].players[player2.userId].width;
        this.games[gameId].players[player2.userId].vxratio = 1;
        this.games[gameId].players[player1.userId].vxratio =
          (this.games[gameId].players[player1.userId].width - 50) /
          (this.games[gameId].players[player2.userId].width - 50);
      }
      this.logger.log(
        `ratio 1 ${this.games[gameId].players[player1.userId].ratio}`,
      );
      this.logger.log(
        `ratio 2 ${this.games[gameId].players[player2.userId].ratio}`,
      );
      // Add the players to the game room
      this.socketGateway.getClientSocket(player1.userId)?.map((socketa) => {
        socketa.join(gameId);
      });
      this.socketGateway.getClientSocket(player2.userId)?.map((socketa) => {
        socketa.join(gameId);
      });
      this.logger.log(`game ${gameId} is created.`);
      this.notifs[player1.userId]?.map((player) => {
        this.socketGateway.getClientSocket(player.user_id)?.map((socketa) => {
          socketa.emit('rminvite', player2.userId);
          socketa.emit('rejected', player1.userId);
        });
        this.socketGateway.getClientSocket(player1.userId)?.map((socketa) => {
          socketa.emit('rminvite', player.user_id);
        });
        this.gameService.deleteGameByUserId(
          Number(player.user_id),
        );
      });
      delete this.notifs[player1.userId];
      this.gameService.deleteGameByUserId(
        Number(player2.userId),
      );
      this.notifs[player2.userId]?.map((player) => {
        if (player.user_id !== player1.userId) {
          this.socketGateway.getClientSocket(player.user_id)?.map((socketa) => {
            socketa.emit('rejected', player2.userId);
          });
          this.socketGateway.getClientSocket(player2.userId)?.map((socketa) => {
            socketa.emit('rminvite', player.user_id);
          });
        } else {
          this.socketGateway.getClientSocket(player.user_id)?.map((socketa) => {
            socketa.emit('rminvite', player1.userId);
          });
        }
      });
      delete this.notifs[player2.userId];

      for (const key in this.notifs) {
        // get the key that the player is inviting
        const player = this.notifs[key].find(
          (player) => player.user_id === player1.userId,
        );
        if (!player) {
          continue;
        } else {
          // get the socket of the player from the key
          this.socketGateway.getClientSocket(key)?.map((socketa) => {
            this.logger.log('emiting rminvite', key, socketa.id);
            socketa.emit('rminvite', player.user_id);
            if (player.user_id !== player2.userId)
              socketa.emit('rejected', player.user_id);
          });
          // Filter out the deleted player
          this.notifs[key] = this.notifs[key].filter(
            (player) => player.user_id !== player1.userId,
          );
          // If there are no more invites for this player, delete the key
          if (this.notifs[key].length === 0) {
            delete this.notifs[key];
          }
        }
      }
      for (const key in this.notifs) {
        // get the key that the player is inviting
        const player = this.notifs[key].find(
          (player) => player.user_id === player2.userId,
        );
        if (!player) {
          continue;
        } else {
          // get the socket of the player from the key
          this.socketGateway.getClientSocket(key)?.map((socketa) => {
            this.logger.log('emiting rminvite', key, socketa.id);
            socketa.emit('rminvite', player.user_id);
            if (player.user_id !== player1.userId)
              socketa.emit('rejected', player.user_id);
          });
          // Filter out the deleted player
          this.notifs[key] = this.notifs[key].filter(
            (player) => player.user_id !== player2.userId,
          );
          // If there are no more invites for this player, delete the key
          if (this.notifs[key].length === 0) {
            delete this.notifs[key];
          }
        }
      }
      this.logger.log('players');
      this.logger.log(this.players);
      this.socketGateway.getServer().to(gameId).emit('startGame', {
        players: this.games[gameId].players,
        bball: this.games[gameId].ball,
        gameId: null,
      });
      this.socketGateway.updateStatus(Number(player1.userId), 'INGAME');
      this.socketGateway.updateStatus(Number(player2.userId), 'INGAME');
      return { id: player1.userId == userId ? player2.userId : player1.userId };
    } else return { id: null };
  }

  @SubscribeMessage('invite')
  handelInvite(client: Socket, data: any) {
    if (data.checkfriend) {
      if (this.notifs[data.userId]) {
        const player = this.notifs[data.userId].find(
          (player) => player.user_id === data.adv_id,
        );
        if (player) {
          return false;
        }
      }
      if (this.players[data.adv_id]?.state === PlayerState.PLAYING) {
        return false;
      }
      return true;
    }
    this.players[data.userId] = {
      s_id: client.id,
      user_id: data.userId,
      username: data.username,
      avatar: data.avatar,
      host: false,
      gameId: data.gameId,
      width: data.width,
      paddleSpeed: 3 * data.difficulty,
      padl: data.padl,
      x: 0,
      y: 0,
      paddleDirection: 0,
      paddle: null,
      score: 0,
      state: PlayerState.INVITING,
    };
    if (!this.notifs[data.adv_id]) {
      this.notifs[data.adv_id] = [];
    }
    const newNotification = {
      user_id: data.userId,
      type: NotifType.GAME, // Replace with the actual type
      avatar: this.players[data.userId].avatar,
      username: this.players[data.userId].username,
      // board: this.players[data.userId].board,
      time: 0,
      paddle: this.players[data.userId].padl,
    };
    this.notifs[data.adv_id] = [...this.notifs[data.adv_id], newNotification];
    this.logger.log(`emiting invite`);
    this.logger.log(this.notifs);
    this.socketGateway.getClientSocket(data.userId)?.map((socketa) => {
      if (socketa.id !== client.id) socketa.emit('alreadyInQueue');
    });
    this.socketGateway.getClientSocket(data.adv_id)?.map((socketa) => {
      socketa.emit('invited', newNotification);
    });
    return true;
  }

  @SubscribeMessage('addFriend')
  handelFriendInvite(client: Socket, data: any) {
    if (!this.notifs[data.frId]) {
      this.notifs[data.frId] = [];
    }
    const newNotification = {
      user_id: data.id,
      type: NotifType.INVITE, // Replace with the actual type
      avatar: data.avatar,
      time: 0,
      username: data.username,
    };
    this.notifs[data.frId] = [...this.notifs[data.frId], newNotification];
    this.logger.log(`emiting request to ${data.username}`);
    this.logger.log(this.notifs);
    this.socketGateway.getClientSocket(data.frId?.toString())?.map((socketa) => {
      socketa.emit('invited', newNotification);
    });
    return true;
  }

  @SubscribeMessage('block')
  handelBlock(client: Socket, data: any) {
    if (!this.notifs[data.frId]) {
      this.notifs[data.frId] = [];
    } else {
      // remove if there is an invite
      this.notifs[data.frId] = this.notifs[data.frId].filter(
        (player) =>
          player.user_id !== data.id && player.type !== NotifType.INVITE,
      );
    }
    if (this.notifs[data.id]) {
      // remove if there is an invite
      this.notifs[data.id] = this.notifs[data.id].filter(
        (player) =>
          player.user_id !== data.frId && player.type !== NotifType.INVITE,
      );
    }
    const newNotification = {
      user_id: data.id,
      type: NotifType.BLOCKED, // Replace with the actual type
      avatar: data.avatar,
      time: Date.now(),
      username: data.username,
    };
    this.notifs[data.frId] = [...this.notifs[data.frId], newNotification];
    this.logger.log(`emiting block to ${data.username}`);
    this.logger.log(this.notifs);
    this.socketGateway.getClientSocket(data.frId?.toString())?.map((socketa) => {
      socketa.emit('blocked', newNotification);
      socketa.emit('rminvite', data.id);
    });
    this.socketGateway.getClientSocket(data.id?.toString())?.map((socketa) => {
      socketa.emit('rminvite', data.frId);
    });
    return true;
  }

  @SubscribeMessage('acceptFriend')
  handelAcceptFriend(client: Socket, data: any) {
    this.logger.log(this.notifs);
    if (!this.notifs[data.frId]) {
      this.notifs[data.frId] = [];
    }
    if (this.notifs[data.id]) {
      this.notifs[data.id] = this.notifs[data.id].filter(
        (notif) =>
          notif.user_id !== data.frId && notif.type !== NotifType.INVITE,
      );
    }
    const newNotification = {
      user_id: data.id,
      type: NotifType.ACCEPTED, // Replace with the actual type
      avatar: data.avatar,
      time: Date.now(),
      username: data.username,
    };
    this.notifs[data.frId] = [...this.notifs[data.frId], newNotification];
    this.logger.log(`emiting accept to ${data.username}`);
    this.logger.log(this.notifs);
    this.socketGateway.getClientSocket(data.frId?.toString())?.map((socketa) => {
      socketa.emit('accepted', newNotification);
    });
    this.socketGateway.getClientSocket(data.id?.toString())?.map((socketa) => {
      socketa.emit('rminvite', data.frId);
    });
    return true;
  }

  @SubscribeMessage('rejectedFriend')
  handleRejectFriend(client: Socket, data: any) {
    if (!this.notifs[data.frId]) {
      this.notifs[data.frId] = [];
    } else {
      this.notifs[data.frId] = this.notifs[data.frId]?.filter(
        (player) =>
          player.user_id !== data.id && player.type !== NotifType.INVITE,
      );
    }
    if (this.notifs[data.id]) {
      this.notifs[data.id] = this.notifs[data.id]?.filter(
        (player) =>
          player.user_id !== data.frId && player.type !== NotifType.INVITE,
      );
    }
    const newNotification = {
      user_id: data.id,
      type: NotifType.REJECTED, // Replace with the actual type
      avatar: data.avatar,
      time: Date.now(),
      username: data.username,
    };
    this.notifs[data.frId] = [...this.notifs[data.frId], newNotification];
    this.logger.log(`emiting reject to ${data.username}`);
    this.logger.log(this.notifs);
    this.socketGateway.getClientSocket(data.frId?.toString())?.map((socketa) => {
      socketa.emit('rejected', newNotification);
    });
    this.socketGateway.getClientSocket(data.id?.toString())?.map((socketa) => {
      socketa.emit('rminvite', data.frId);
    });
    return true;
  }

  @SubscribeMessage('inviteResp')
  handelInviteResp(client: Socket, data: any) {
    if (data.accepted) {
      if (!this.players[data.userId]) {
        this.socketGateway.getClientSocket(data.adv_id)?.map((socketa) => {
          socketa.emit('rejected', data.adv_id);
        });
        return false;
      }
      const isUserInQueue = this.queue?.find((c) => c.userId === data.adv_id);
      if (isUserInQueue) {
        this.queue?.splice(this.queue?.indexOf(isUserInQueue), 1);
        this.gameService.deleteGameByUserId(
          Number(data.adv_id),
        );
      }
      this.players[data.adv_id] = {
        s_id: client.id,
        user_id: data.adv_id,
        username: data.username,
        avatar: data.avatar,
        host: false,
        x: 0,
        y: 0,
        paddleDirection: 0,
        paddle: null,
        score: 0,
        paddleSpeed: this.players[data.userId]?.paddleSpeed,
        padl: this.players[data.userId]?.padl,
        width: data.width,
        state: PlayerState.PLAYING,
      };
      this.players[data.userId].state = PlayerState.PLAYING;
      const gameId = `${this.players[data.userId]?.s_id}-${
        this.players[data.adv_id].s_id
      }`;
      // Initialize the game state
      this.games[gameId] = {
        players: {
          [data.userId]: this.players[data.userId],
          [data.adv_id]: this.players[data.adv_id],
        },
        ball: this.ball,
        state: gameStatus.NONE,
        update: true,
      };
      this.games[gameId].players[data.adv_id].host = true;
      if (
        this.games[gameId].players[data.adv_id].width <
        this.games[gameId].players[data.userId].width
      ) {
        this.games[gameId].players[data.adv_id].ratio = 1;
        this.games[gameId].players[data.userId].ratio =
          this.games[gameId].players[data.userId].width /
          this.games[gameId].players[data.adv_id].width;
        this.games[gameId].players[data.adv_id].vxratio = 1;
        this.games[gameId].players[data.userId].vxratio =
          (this.games[gameId].players[data.userId].width - 50) /
          (this.games[gameId].players[data.adv_id].width - 50);
      } else {
        this.games[gameId].players[data.userId].ratio = 1;
        this.games[gameId].players[data.adv_id].ratio =
          this.games[gameId].players[data.adv_id].width /
          this.games[gameId].players[data.userId].width;
        this.games[gameId].players[data.userId].vxratio = 1;
        this.games[gameId].players[data.adv_id].vxratio =
          (this.games[gameId].players[data.adv_id].width - 50) /
          (this.games[gameId].players[data.userId].width - 50);
      }
      // Add the players to the game room
      this.socketGateway.getClientSocket(data.userId)?.map((socketa) => {
        socketa.join(gameId);
      });
      this.socketGateway.getClientSocket(data.adv_id)?.map((socketa) => {
        socketa.join(gameId);
      });
      this.logger.log(`game ${gameId} is created.`);

      this.socketGateway.getServer().to(gameId).emit('startGame', {
        players: this.games[gameId].players,
        bball: this.games[gameId].ball,
        gameId: this.players[data.userId]?.gameId,
      });
      this.socketGateway.updateStatus(Number(data.userId), 'INGAME');
      this.socketGateway.updateStatus(Number(data.adv_id), 'INGAME');
      this.notifs[data.userId]?.map((player) => {
        this.socketGateway.getClientSocket(player.user_id)?.map((socketa) => {
          socketa.emit('rminvite', data.adv_id);
          socketa.emit('rejected', data.userId);
        });
        this.socketGateway.getClientSocket(data.userId)?.map((socketa) => {
          socketa.emit('rminvite', player.user_id);
        });
        this.gameService.deleteGameByUserId(
          Number(player.user_id),
        );
      });
      delete this.notifs[data.userId];
      this.gameService.deleteGameByUserId(
        Number(data.adv_id),
      );
      this.notifs[data.adv_id]?.map((player) => {
        if (player.user_id !== data.userId) {
          this.socketGateway.getClientSocket(player.user_id)?.map((socketa) => {
            socketa.emit('rejected', data.adv_id);
          });
          this.socketGateway.getClientSocket(player.user_id)?.map((socketa) => {
            socketa.emit('rminvite', data.userId);
          });
        } else {
          this.socketGateway.getClientSocket(player.user_id)?.map((socketa) => {
            socketa.emit('rminvite', data.adv_id);
          });
          this.socketGateway.getClientSocket(data.adv_id)?.map((socketa) => {
            socketa.emit('rminvite', player.user_id);
          });
        }
      });
      delete this.notifs[data.adv_id];

      for (const key in this.notifs) {
        // get the key that the player is inviting
        const player = this.notifs[key]?.find(
          (player) => player.user_id === data.userId,
        );
        if (!player) {
          continue;
        } else {
          // get the socket of the player from the key
          this.socketGateway.getClientSocket(key)?.map((socketa) => {
            this.logger.log('emiting rminvite', key, socketa.id);
            socketa.emit('rminvite', player.user_id);
            if (player.user_id !== data.adv_id)
              socketa.emit('rejected', player.user_id);
          });
          // Filter out the deleted player
          this.notifs[key] = this.notifs[key]?.filter(
            (player) => player.user_id !== data.userId,
          );
          // If there are no more invites for this player, delete the key
          if (this.notifs[key]?.length === 0) {
            delete this.notifs[key];
          }
        }
      }
      for (const key in this.notifs) {
        // get the key that the player is inviting
        const player = this.notifs[key]?.find(
          (player) => player.user_id === data.adv_id,
        );
        if (!player) {
          continue;
        } else {
          // get the socket of the player from the key
          this.socketGateway.getClientSocket(key)?.map((socketa) => {
            this.logger.log('emiting rminvite', key, socketa.id);
            socketa.emit('rminvite', player.user_id);
            if (player.user_id !== data.userId)
              socketa.emit('rejected', player.user_id);
          });
          // Filter out the deleted player
          this.notifs[key] = this.notifs[key]?.filter(
            (player) => player.user_id !== data.adv_id,
          );
          // If there are no more invites for this player, delete the key
          if (this.notifs[key]?.length === 0) {
            delete this.notifs[key];
          }
        }
      }
      return true;
    } else {
      this.logger.log('inivite rejected', data.userId);
      for (const key in this.notifs) {
        // get the key that the player is inviting
        const player = this.notifs[key]?.find(
          (player) => player.user_id === data.userId,
        );
        if (!player) {
          continue;
        } else {
          // get the socket of the player from the key
          this.socketGateway.getClientSocket(key)?.map((socketa) => {
            this.logger.log('emiting rminvite', key, socketa.id);
            socketa.emit('rminvite', data.userId);
          });
          // Filter out the deleted player
          this.notifs[key] = this.notifs[key]?.filter(
            (player) => player.user_id !== data.userId,
          );
          // If there are no more invites for this player, delete the key
          if (this.notifs[key].length === 0) {
            delete this.notifs[key];
          }
        }
      }
      this.gameService.deleteGameByUserId(
        Number(data.userId),
      );
      this.socketGateway.getClientSocket(data.userId)?.map((socketa) => {
        socketa.emit('rejected', {
          userId: data.adv_id,
          avatar: data.avatar,
          username: data.username,
          type: NotifType.REJECTED,
        });
      });
      return false;
    }
  }

  @SubscribeMessage('keydown')
  handelKeyDown(client: Socket, data: any) {
    const gameId = Object.keys(this.games).find(
      (id) => this.games[id].players[data.userId],
    );

    // this.logger.log(`emiting move ${gameId} ${data.userId}`);
    if (gameId) {
      this.games[gameId].ball = {
        ...this.games[gameId].ball,
        ...data.ball,
      };
      // this.logger.log(`emiting move again ${gameId} ${data.userId}`);
      // Emit the 'move' event to the other player in the game
      this.socketGateway.getServer().to(gameId).emit('move', data);
    }
  }

  @SubscribeMessage('getNotifs')
  getNotifs(client: Socket, data: any) {
    this.logger.log(`getNotifs ${client.id}---- `);
    this.logger.log(this.notifs);

    if (data.userId) {
      const notifs = this.notifs[data.userId];
      return notifs ? notifs : [];
    }
    return [];
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
    if (gameId) {
      this.games[gameId].ball = {
        ...this.games[gameId].ball,
        ...data.ball,
      };
      // this.logger.log(
      //   `emiting move again ${gameId} ${data.userId} H: ${data.pH} G: ${data.pG}`,
      // );
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
        if (this.games[gameId].update) {
          this.games[gameId].update = false;
          this.games[gameId].ball = {
            ...this.games[gameId].ball,
            ...{
              cx: this.games[gameId].players[data.userId].width / 2,
              cy: 600 / 2,
              vx: 0,
              vy: 0,
            },
          };
          Object.values(this.games[gameId].players).find(
            (player: any) => player.host,
          ).score = data.playerLeft;
          // check the other player
          Object.values(this.games[gameId].players).find(
            (player: any) => !player.host,
          ).score = data.playerRight;
          this.logger.log(
            `score ${data.playerLeft} ${data.playerRight} ${this.games[gameId].ball.cx} ${client.id}}`,
          );
          this.socketGateway.getServer().to(gameId).emit('reset', {
            ball: this.games[gameId].ball,
            playerLeft: data.playerLeft,
            playerRight: data.playerRight,
            userId: data.userId,
          });
        }
      } else if (data.action === 'start') {
        // Emit the 'start' event to players in the game to start the game
        this.games[gameId].update = true;
        this.games[gameId].state = gameStatus.PLAYING;
        this.socketGateway
          .getServer()
          .to(gameId)
          .emit('start', { ball: this.games[gameId].ball });
      } else if (data.action === 'done') {
        this.logger.log(`game status ${this.games[gameId].state}`);
        if (this.games[gameId].state != gameStatus.FINISHED) {
          this.games[gameId].state = gameStatus.FINISHED;
          this.logger.log(
            `done   left ${data.playerRight} right ${data.playerLeft} ${client.id}`,
          );
          // Update the game state
          const winnerId: number =
            data.playerLeft > data.playerRight
              ? Object.values(this.games[gameId].players).find(
                  (player: any) => player.host,
                ).user_id
              : Object.values(this.games[gameId].players).find(
                  (player: any) => !player.host,
                ).user_id;
          const loserId: number = Object.values(
            this.games[gameId].players,
          ).find((player: any) => player.user_id !== winnerId).user_id;
          delete this.players[winnerId];
          delete this.players[loserId];
          delete this.games[gameId];
          const gamed = this.gameService.finishGame(
            Number(loserId),
            Number(winnerId),
            data.playerLeft > data.playerRight
              ? data.playerLeft
              : data.playerRight,
            data.playerLeft < data.playerRight
              ? data.playerLeft
              : data.playerRight,
            gameStatus.FINISHED,
          );
          // Emit the 'done' event to players in the game to end the game
          this.socketGateway.getServer().to(gameId).emit('done', {
            playerLeft: data.playerLeft,
            playerRight: data.playerRight,
            winnerId,
            loserId,
            gamed,
          });
          this.socketGateway.updateStatus(Number(winnerId), 'ONLINE');
          this.socketGateway.updateStatus(Number(loserId), 'ONLINE');
        }
      } else {
        // Emit the 'ballVel' event to players in the game to update the ball
        if (data.action === 'paddle') {
          this.socketGateway
            .getServer()
            .to(gameId)
            .emit('ballVel', { reset: true, ball: this.games[gameId].ball });
        } else {
          this.socketGateway
            .getServer()
            .to(gameId)
            .emit('ballVel', { ball: this.games[gameId].ball });
        }
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
      client.to(gameId).emit('getFrame', data, (response: any) => {
        // Handle the response here
        if (response instanceof Error) {
          this.socketGateway
            .getServer()
            .to(gameId)
            .emit('initFrame', {
              ball: this.games[gameId].ball,
              y1: data.y1,
              y2: data.y2,
              playerLeft: Object.values(this.games[gameId].players).find(
                (player: any) => player.host,
              ).score,
              playerRight: Object.values(this.games[gameId].players).find(
                (player: any) => !player.host,
              ).score,
              id: data.userId,
            });
          // Add additional error handling logic here
        } else {
          // Handle the successful response here
        }
      });
    }
  }

  @SubscribeMessage('playOpen')
  async handlePlayOpen(client: Socket, data: any) {
    // Extract the user ID from the client
    const gameId = Object.keys(this.games).find(
      (id) => this.games[id].players[data.userId],
    );

    if (gameId) {
      // Add the new socket to the game room
      client.join(gameId);
      // playeer is already in game
      client.emit('startGame', {
        players: this.games[gameId].players,
        bball: this.games[gameId].ball,
        gameId: this.players[data.userId].gameId,
      });
    } else {
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
    this.logger.log(
      `emiting updateFrame ${gameId} ${data.userId} ${data.playerLeft} ${data.playerRight} ${data.ball.cy} `,
    );
    if (gameId) {
      this.games[gameId].ball = {
        ...this.games[gameId].ball,
        ...data.ball,
      };
      // if (
      //   data.playerLeft === 0 &&
      //   data.playerRight === 0 &&
      //   this.games[gameId].state === gameStatus.PLAYING &&
      //   data.ball.cy === 300
      // ) {
      //   this.socketGateway
      //     .getServer()
      //     .to(gameId)
      //     .emit('initFrame', {
      //       ball: this.games[gameId].ball,
      //       y1: data.y1,
      //       y2: data.y2,
      //       playerLeft: Object.values(this.games[gameId].players).find(
      //         (player: any) => player.host,
      //       ).score,
      //       playerRight: Object.values(this.games[gameId].players).find(
      //         (player: any) => !player.host,
      //       ).score,
      //       id: data.userId,
      //     });
      // } else {
      // Emit the 'move' event to the other player in the game
      this.socketGateway.getServer().to(gameId).emit('updateFrame', {
        ball: this.games[gameId].ball,
        y1: data.y1,
        y2: data.y2,
        playerLeft: data.playerLeft,
        playerRight: data.playerRight,
        id: data.userId,
      });
      // }
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
