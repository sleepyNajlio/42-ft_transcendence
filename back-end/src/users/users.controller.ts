import {
  Controller,
  Get,
  Req,
  HttpException,
  HttpStatus,
  SetMetadata,
  Param,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpDTO } from './dto/SignUp.dto';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';


@Controller('user')
export class UsersController {
  constructor(private readonly UsersService: UsersService,
    private Config: ConfigService) {}

  @SetMetadata('isPublic', true)
  @Get()
  async GetProfileData(@Req() req: Request) {
    // console.log("GetProfileData begin");
    if (req.cookies['JWT_TOKEN']) {
      const user = await this.UsersService.GetUserByToken(
        req.cookies['JWT_TOKEN'],
      );
      return user;
    }
    else if (req.cookies['USER']) {
      const user = await this.UsersService.GetUserByToken(
        req.cookies['USER'],
      );
      return user;
    }
    else
      throw new HttpException('No Cookies', HttpStatus.UNAUTHORIZED);
  }

  // @Get('/:id')
  // async getUserById(@Param() { id }: { id: string }) {
  //   console.log(id);
  //   const user = await this.UsersService.getUserById(Number(id));
  //   return user;
  // }

  @Get("/logout")
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    console.log("logging out");
    if (req.cookies['JWT_TOKEN']){
      res.cookie('JWT_TOKEN', '', { expires: new Date() });
      res.redirect(`${this.Config.get('FRONTEND_URL')}/`);
      // return "Logge/d out";
    }
    else if (req.cookies['USER']) {
      res.cookie('USER', '', { expires: new Date() });
      res.redirect(`${this.Config.get('FRONTEND_URL')}/`);
      // return "Logged out";
    }
    else
      throw new HttpException('No Cookies', HttpStatus.UNAUTHORIZED);

  }
}
