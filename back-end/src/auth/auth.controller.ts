import { Controller, Post, Get, UseGuards, Req, Res, SetMetadata, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { FTAuthGuard } from './guards/42.auth.guard';
import { JwtService } from '@nestjs/jwt';
import { SignUpDTO } from 'src/users/dto/SignUp.dto';
import { Sign } from 'crypto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SetMetadata('isPublic', true)
  @UseGuards(FTAuthGuard)
  @Get('42')
  FTAUth() {
    return "Authentication 42";
  }

  @SetMetadata('isPublic', true)
  @UseGuards(FTAuthGuard)
  @Get('42-redirect')
  async FTCallback(@Req() req, @Res( {passthrough: true}) res: Response) {
    // console.log("FTCallback begin");
    // console.log(req.user);
    const cookie = await this.authService.signToken(req.user["email"]);
    if (req.user["isAuthenticated"]) {
      console.log("mwellef");
      res.cookie('JWT_TOKEN', cookie, { httpOnly: true });
      return "mwellef";
      // res.redirect("http://localhost:3000/");
    }
    else {
      console.log("first time");
      res.cookie('USER', cookie, { httpOnly: true });
      // return "first time";
      return cookie;
      res.redirect("http://localhost:3000/auth/finish-signup");
    }
    // console.log(req.user);
    // return "Authentication 42 callback";
    // return this.authService.login();
  }

  @SetMetadata('isPublic', true)
  @Post('finish-signup')
  async finish_signup(
    @Body() dto: SignUpDTO,
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {

    if (req.cookies) {
      if (!req.cookies["USER"])
      throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);   
    }
    else throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    console.log("finish_signup controller");
    const UserToken = req.cookies['USER'];
    const token = await this.authService.finish_signup(dto, UserToken);
    res.cookie('JWT_TOKEN', token);
    res.cookie('USER', '', { expires: new Date() });
  }

}
