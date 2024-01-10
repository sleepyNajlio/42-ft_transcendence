import { Controller, Get, Param, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Request } from 'express';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  async getUserInfo(@Req() req: Request) {
    const token = req.cookies['JWT_TOKEN']; // Get the JWT from cookies
    if (!token) {
      throw new Error('Access token not found');
    }
    const user = await this.profileService.getUserInfoFromToken(token);
    return { user: user };
  }

  @Get('/all')
  async getAllUsers(@Req() req: Request) {
    const token = req.cookies['JWT_TOKEN']; // Get the JWT from cookies
    if (!token) {
      throw new Error('Access token not found');
    }
    const users = await this.profileService.getAllUsers(token);
    return { users: users };
  }

  @Get('/:id')
  async getUserById(@Param() { id }: { id: string }) {
    console.log(id);
    const user = await this.profileService.getUserById(Number(id));
    return user;
  }

  @Get('/history/:id')
  async getMatchHistory(@Param() { id }: { id: string }) {
    const matches = await this.profileService.getMatchHistory(Number(id));
    return matches;
  }

  @Get('/game/:id')
  async getMatchStats(@Param() { id }: { id: string }) {
    const stats = await this.profileService.getMatchStats(Number(id));
    return stats;
  }

  // @Get('/ranks')
  // async getUsersRank() {
  //   const user = await this.profileService.getUsersRank();
  //   return user;
  // }

  // @Get('/rank/:id')
  // async getUsersRankId(@Param() { id }: { id: string }) {
  //   console.log(id);
  //   const user = await this.profileService.getUsersRankId(Number(id));
  //   return user;
  // }
}
