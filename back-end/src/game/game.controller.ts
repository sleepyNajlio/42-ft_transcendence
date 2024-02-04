import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { GameStatus } from '@prisma/client';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('createGame')
  async createGame() {
    const game = await this.gameService.createGame();
    return game;
  }

  @Get(':userId/getGame/:status')
  async getGameByUserId(
    @Param() { userId }: { userId: string },
    @Param() { status }: { status: GameStatus },
  ) {
    const game = await this.gameService.getGameByUserId(Number(userId), status);
    return game;
  }

  @Delete(':userId/deletegame')
  async deleteGameByUserId(
    @Param() { userId }: { userId: string },
  ) {
    const game = await this.gameService.deleteGameByUserId(Number(userId));
    return game;
  }

  @Post(':gameId/joinGame')
  async joinGame(
    @Param() { gameId }: { gameId: string },
    @Body() { userId }: { userId: string },
  ) {
    const game = await this.gameService.joinGame(
      Number(gameId),
      Number(userId),
    );
    return game;
  }

  @Post(':gameId/updateGame')
  async updateGame(
    @Param() { gameId }: { gameId: string },
    @Body() { status }: { status: GameStatus },
  ) {
    const game = await this.gameService.updateGame(Number(gameId), status);
    return game;
  }

  @Post(':gameId/:userId/updateUserGame')
  async updateUserGame(
    @Param() { gameId }: { gameId: string },
    @Param() { userId }: { userId: string },
    @Body() { win }: { win: number },
    @Body() { score }: { score: number },
  ) {
    const game = await this.gameService.updateUserGame(
      Number(userId),
      Number(gameId),
      win,
      score,
    );
    return game;
  }

  @Get('getGame')
  getGame() {
  }
}
