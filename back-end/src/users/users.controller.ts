import {
  Controller,
  Get,
  Req,
  HttpException,
  HttpStatus,
  SetMetadata,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpDTO } from './dto/SignUp.dto';
import { Request } from 'express';


@Controller('profile')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @SetMetadata('isPublic', true)
  @Get()
  async GetProfileData(@Req() req: Request) {
    console.log("GetProfileData begin");
    if (req.cookies['JWT_TOKEN']) {
      const user = await this.usersService.GetUserByToken(
        req.cookies['JWT_TOKEN'],
      );
      return user;
    }
    else if (req.cookies['USER']) {
      const user = await this.usersService.GetUserByToken(
        req.cookies['USER'],
      );
      return user;
    }
    else
      throw new HttpException('No Cookies', HttpStatus.UNAUTHORIZED);
  }
}
