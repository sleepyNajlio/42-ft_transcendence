import {
  Controller,
  Get,
  Req,
  HttpException,
  HttpStatus,
  SetMetadata,
  Param,

} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { SignUpDTO } from './dto/SignUp.dto';
import { Request } from 'express';


@Controller('profile')
export class ProfileController {
  constructor(private readonly ProfileService: ProfileService) {}

  @SetMetadata('isPublic', true)
  @Get()
  async GetProfileData(@Req() req: Request) {
    // console.log("GetProfileData begin");
    if (req.cookies['JWT_TOKEN']) {
      const user = await this.ProfileService.GetUserByToken(
        req.cookies['JWT_TOKEN'],
      );
      return user;
    }
    else if (req.cookies['USER']) {
      const user = await this.ProfileService.GetUserByToken(
        req.cookies['USER'],
      );
      return user;
    }
    else
      throw new HttpException('No Cookies', HttpStatus.UNAUTHORIZED);
  }

  @Get('/all')
  async getAllUsers(@Req() req: Request) {
    const token = req.cookies['JWT_TOKEN']; // Get the JWT from cookies
    if (!token) {
      throw new Error('Access token not found');
    }
    const users = await this.ProfileService.getAllUsers(token);
    return { users: users };
  }

  @Get('/:id')
  async getUserById(@Param() { id }: { id: string }) {
    console.log(id);
    const user = await this.ProfileService.getUserById(Number(id));
    return user;
  }
}
