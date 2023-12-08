import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

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

  async joinGame(gameId: number, userId: number) {
    try {
      const userGame = await this.prisma.userGame.create({
        data: {
          game: {
            connect: { id_game: gameId },
          },
          user: {
            connect: { id_player: userId },
          },
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
