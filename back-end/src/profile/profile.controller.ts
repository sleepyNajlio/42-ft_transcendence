import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  SetMetadata,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Request } from 'express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  @SetMetadata('isPublic', true)
  async getUserInfo(@Req() req: Request) {
    const token = req.cookies['JWT_TOKEN'] || req.cookies['USER']; // Get the JWT from cookies
    if (!token) {
      throw new HttpException('no token', HttpStatus.OK);
    }
    const user = await this.profileService.getUserInfoFromToken(token);
    return { user: user };
  }

  @Get('/friend/:id')
  async getUserById(@Req() req: Request, @Param() { id }: { id: string }) {
    const owuser = req.user;
    const  user  = await this.profileService.getUserById(Number(id));
    const friendStatus = await this.profileService.getFriendStatus(
      Number(id),
      Number(owuser['id_player']),
    );
    return { user, state: friendStatus };
  }
  
  @Post('/friend')
  async addFriend(@Req() req: Request, @Body() { id }: { id: string }) {
    const owuser = req.user;
    await this.profileService.addFriend(
      Number(id),
      Number(owuser['id_player']),
    );
    return { message: 'Friend request sent' };
  }

  @Post('/update/friend')
  async blockFriend(
    @Req() req: Request,
    @Body() { id, status }: { id: string; status: string },
  ) {
    const owuser = req.user;
      await this.profileService.updateStatus(
        Number(id),
        Number(owuser['id_player']),
        status,
      );
      return { message: 'Friend is '+ status };
  }

  @Get('/notfriend')
  async getNotFriend(@Req() req: Request) {
    const owuser = req.user;
    const users = await this.profileService.getNotFriend(
      Number(owuser['id_player']),
    );
    return { users: users };
  }

  @Get('/block')
  async getBockedUsers(@Req() req: Request) {
    const owuser = req.user;
    /* get all blocked users */
    const users = await this.profileService.getBockedUsers(
      Number(owuser['id_player']),
    );
    return { users: users };
  }

  @Get('/notBlocked')
  async getNotBockedUsers(@Req() req: Request) {
    const owuser = req.user;
    /* get all blocked users */
    const users = await this.profileService.getNotBockedUsers(
      Number(owuser['id_player']),
    );
    return { users: users };
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

  @Get('/ranks')
  async getUsersRank() {
    const users = await this.profileService.getUsersRank();
    return users;
  }

  @Get('/rank/:id')
  async getUsersRankId(@Param() { id }: { id: string }) {
    const rank = await this.profileService.getUsersRankId(Number(id));
    return rank;
  }

  // @Get('/rank/:id')
  // async getUsersRankId(@Param() { id }: { id: string }) {
  //   const user = await this.profileService.getUsersRankId(Number(id));
  //   return user;
  // }
}
