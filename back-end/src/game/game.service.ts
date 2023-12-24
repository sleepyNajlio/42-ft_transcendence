import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameStatus } from '@prisma/client';

@Injectable()
export class GameService {
  constructor(private prisma: PrismaService) {}

  async createGame() {
    // Add your implementation here
    try {
      const game = await this.prisma.game.create({
        data: {
          status: 'SEARCHING',
        },
      });
      return game;
    } catch (error) {
      console.error(error);
    }
  }

  getGameByUserId(userId: number, status: GameStatus) {
    try {
      const game = this.prisma.game.findFirst({
        where: {
          status: status,
          users: {
            some: {
              userId: userId,
            },
          },
        },
      });
      return game;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteGameByUserId(userId: number, status: GameStatus) {
    try {
      const game = await this.prisma.game.findFirst({
        where: {
          status: status,
          users: {
            some: {
              userId: userId,
            },
          },
        },
      });
      if (!game || game === undefined) {
        return null;
      }
      await this.prisma.userGame.deleteMany({
        where: {
          gameId: game.id_game,
          userId: userId,
        },
      });
      Logger.log('delete User Game');
      await this.prisma.game.delete({
        where: {
          id_game: game.id_game,
        },
      });
      Logger.log('delete Game');
      return game;
    } catch (error) {
      console.error(error);
    }
  }

  async joinGame(gameId: number, userId: number) {
    try {
      const userGame = await this.prisma.userGame.create({
        data: {
          game: {
            connect: {
              id_game: gameId,
            },
          },
          user: {
            connect: {
              id_player: userId,
            },
          },
        },
      });
      return userGame;
    } catch (error) {
      console.error(error);
    }
  }

  async updateGame(gameId: number, status: GameStatus) {
    try {
      const Game = await this.prisma.game.update({
        where: {
          id_game: gameId,
        },
        data: {
          status: status,
        },
      });
      return Game;
    } catch (error) {
      console.error(error);
    }
  }

  async updateUserGame(userId: number, gameId: number, win: number) {
    console.log(
      ' updateUserGame ' + userId + ' game ' + gameId + 'status ' + win + '',
    );
    try {
      const userGame = await this.prisma.userGame.update({
        where: {
          userId_gameId: {
            userId: userId,
            gameId: gameId,
          },
        },
        data: {
          win: win,
        },
      });
      return userGame;
    } catch (error) {
      console.error(error);
    }
  }

  async getGame() {
    // Add your implementation here
  }
}
