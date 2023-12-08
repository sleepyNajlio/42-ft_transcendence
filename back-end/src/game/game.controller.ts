import { Body, Controller, Get, Post } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('createGame')
  async createGame() {
    const game = await this.gameService.createGame();
    return game;
  }

  @Post('joinGame')
  async joinGame(@Body() data: { gameId: number; userId: number }) {
    const game = await this.gameService.joinGame(data.gameId, data.userId);
    return game;
  }

  @Get('getGame')
  getGame() {
    // Add your implementation here
  }
}
