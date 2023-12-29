import { Controller, Get, Req, Post } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService,
    private prisma: PrismaService) {}

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
  // @Post('/update')
  // // prisma = new PrismaClient();

  // async updateUser(@Req() req: Request) {
  //   const token = req.cookies['JWT_TOKEN']; // Get the JWT from cookies
  //   if (!token) {
  //     throw new Error('Access token not found');
  //   }

  //   const twofaSecret = generateNewTwofaSecret(); // Generate a new twofaSecret

  //   // Update the twofasecret in the database using Prisma Client
  //   await this.prisma.player.update({
  //     where: { token },
  //     data: { twofaSecret },
  //   });

  //   // Return the updated user
  //   const user = await this.profileService.getUserInfoFromToken(token);
  //   return { user: user };
  // }
}
