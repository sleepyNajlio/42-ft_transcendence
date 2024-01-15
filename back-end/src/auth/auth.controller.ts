import {
  Controller,
  Post,
  Get,
  UseGuards,
  Req,
  Res,
  SetMetadata,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { FTAuthGuard } from './guards/42.auth.guard';
import { SignUpDTO } from 'src/users/dto/SignUp.dto';
import { ConfigService } from '@nestjs/config';
import { TwofaService } from './twofa.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private Config: ConfigService,
    private twofaService: TwofaService,
  ) {}

  @SetMetadata('isPublic', true)
  @UseGuards(FTAuthGuard)
  @Get('42')
  FTAUth() {}

  @SetMetadata('isPublic', true)
  @UseGuards(FTAuthGuard)
  @Get('42-redirect')
  async FTCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    // console.log("FTCallback begin");
    // console.log(req.user);
    const cookie = await this.authService.signToken(req.user);
    console.log(req.user['isAuthenticated']);
    if (req.user['isAuthenticated']) {
      console.log('mwellef');
      res.cookie('JWT_TOKEN', cookie, { httpOnly: true });
      // return 'mwellef';
      res.redirect(`${this.Config.get('FRONTEND_URL')}/Profile`);
    } else {
      console.log('first time');
      res.cookie('USER', cookie, { httpOnly: true });
      // return "first time";
      // return cookie;
      res.redirect(`${this.Config.get('FRONTEND_URL')}/Config`);
    }
    // console.log(req.user);
    // return "Authentication 42 callback";
    // return this.authService.login();
  }

  @SetMetadata('isPublic', true)
  @Post('finish_signup')
  async finish_signup(
    @Body() dto: SignUpDTO,
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (req.cookies) {
      if (!req.cookies['USER'])
        throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    } else throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    console.log('finish_signup controller');
    const UserToken = req.cookies['USER'];
    const token = await this.authService.finish_signup(dto, UserToken);
    res.cookie('JWT_TOKEN', token);
    console.log(res.cookie);
    res.cookie('USER', '', { expires: new Date() });
    return { msg: 'User created' };
  }

  // @SetMetadata('isPublic', true)
  @Get("twofa/generate")
	async register(@Req() req: Request, @Res() res: Response) {
    // console.log("twofa/generate, ", req.user);
		const otpauthUrl  = await this.twofaService.genrateTwoFaSecret(req.user['id_player'], req.user['email']);
		return this.twofaService.pipeQrCodeStream(res, otpauthUrl);
	}
  
}
