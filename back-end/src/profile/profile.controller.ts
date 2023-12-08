import { Controller, Get, Req } from '@nestjs/common';
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
}
