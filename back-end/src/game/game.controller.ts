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

  @Delete(':userId/deletegame/:status')
  async deleteGameByUserId(
    @Param() { userId }: { userId: string },
    @Param() { status }: { status: GameStatus },
  ) {
    // console.log('user ' + userId + ' delete game ' + status + '');
    const game = await this.gameService.deleteGameByUserId(
      Number(userId),
      status,
    );
    return game;
  }

  @Post(':gameId/joinGame')
  async joinGame(
    @Param() { gameId }: { gameId: string },
    @Body() { userId }: { userId: string },
  ) {
    // console.log('user ' + userId + ' join game ' + gameId + '');
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
    // console.log(' game ' + gameId + 'status ' + status + '');
    const game = await this.gameService.updateGame(Number(gameId), status);
    return game;
  }

  @Post(':gameId/:userId/updateUserGame')
  async updateUserGame(
    @Param() { gameId }: { gameId: string },
    @Param() { userId }: { userId: string },
    @Body() { win }: { win: number },
  ) {
    const game = await this.gameService.updateUserGame(
      Number(userId),
      Number(gameId),
      win,
    );
    return game;
  }

  @Get('getGame')
  getGame() {
    console.log('get game');
  }
}
