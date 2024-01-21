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
  @SetMetadata("isPublic", true)
  async getUserInfo(@Req() req: Request) {
    const token = req.cookies['JWT_TOKEN'] || req.cookies["USER"]; // Get the JWT from cookies
    if (!token) {
      throw new HttpException("no token", HttpStatus.OK);
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

  // @Get('/:id')
  // async getUserById(@Param() { id }: { id: string }) {
  //   console.log(id);
  //   const user = await this.profileService.getUserById(Number(id));
  //   return user;
  // }

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
    // console.log('====================rank');
    // return 'rank';
    const users = await this.profileService.getUsersRank();
    return users;
  }

  @Post('/upload/:userId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Specify your upload directory
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: any,
    @Body() body: { username: string },
    @Param('userId') userId: string,
  ) {
    console.log(file); // You can access the file details here
    await this.profileService.updateUser(
      Number(userId),
      file.filename,
      body.username,
    );
    return { message: 'File uploaded successfully' };
  }

  @Get('/rank/:id')
  async getUsersRankId(@Param() { id }: { id: string }) {
    console.log(id);
    const rank = await this.profileService.getUsersRankId(Number(id));
    return rank;
  }

  // @Get('/rank/:id')
  // async getUsersRankId(@Param() { id }: { id: string }) {
  //   console.log(id);
  //   const user = await this.profileService.getUsersRankId(Number(id));
  //   return user;
  // }
}
