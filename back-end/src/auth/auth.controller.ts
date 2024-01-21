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
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { FTAuthGuard } from './guards/42.auth.guard';
import { SignUpDTO, Update2faDTO } from 'src/users/dto/SignUp.dto';
import { ConfigService } from '@nestjs/config';
import { TwofaService } from './twofa.service';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private Config: ConfigService,
    private twofaService: TwofaService,
    private user: UsersService,
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
    const cookie = await this.authService.signToken(req.user);
    if (req.user['twofa']) {
      res.cookie('TWOFA', cookie, { httpOnly: true });
      res.redirect(`${this.Config.get('FRONTEND_URL')}/Verify2FA`);
    }
    else if (req.user['isAuthenticated']) {
      res.cookie('JWT_TOKEN', cookie, { httpOnly: true });
      res.redirect(`${this.Config.get('FRONTEND_URL')}/Profile`);
    }
    else {
      res.cookie('USER', cookie, { httpOnly: true });
      res.redirect(`${this.Config.get('FRONTEND_URL')}/Config`);
    }
  }

  @SetMetadata('isPublic', true)
  @Post('finish_signup')
  async finish_signup(
    @Body() dto: SignUpDTO,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (req.cookies) {
      if (!req.cookies['USER'])
        throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    } else throw new HttpException('Invalid Request', HttpStatus.BAD_REQUEST);
    // console.log('finish_signup controller');
    const UserToken = req.cookies['USER'];
    const token = await this.authService.finish_signup(dto, UserToken);
    res.cookie('JWT_TOKEN', token);
    // console.log(res.cookie);
    res.cookie('USER', '', { expires: new Date() });
    return { msg: 'User created' };
  }

  @Get('twofa/generate')
  @SetMetadata('isPublic', true)
  async register(@Req() req: Request, @Res() res: Response) {
    const user = await this.user.GetUserByToken(req.cookies['USER'] || req.cookies['JWT_TOKEN']);
    const otpauthUrl = await this.twofaService.genrateTwoFaSecret(
      user.id_player,
      user.email,
   );
    return this.twofaService.pipeQrCodeStream(res, otpauthUrl);
  }

  @Post('twofa/turn-on')
  @SetMetadata('isPublic', true)
  async turnOnTwoFa(@Req() req: Request, @Body() twofa: Update2faDTO) {
    console.log('turnOnTwoFa controller');
    const user = await this.user.GetUserByToken(req.cookies['USER'] || req.cookies['JWT_TOKEN']);
    const isCodeValid = await this.twofaService.verifyTwoFaToken(
      twofa.twoFaCode,
      user,
    );
    console.log(isCodeValid);
    if (!isCodeValid) {
      return { success: false, msg: 'Invalid Code' };
    }
    return { success : true };
  }
  @Get('twofa/check')
  async checkTwoFa(@Req() req: Request) {
    const user = await this.user.findByEmail(req.user['email']);
    return { isTwoFaEnabled: user.twofa };
  }

  @Get('twofa/turn-off')
  async turnOffTwoFa(@Req() req: Request) {
    console.log('turnOffTwoFa controller');
    await this.user.updateTwoFaStatus(req.user['id_player'], false);
    return { success: true };
  }

  
  @Post('twofa/verify')
  @SetMetadata('isPublic', true)
  async verifyTwoFa(@Req() req: Request, @Body() twofa: Update2faDTO, @Res({ passthrough: true }) res: Response ) {
    console.log('verifyTwoFa controller');
    if (req.cookies['TWOFA']) {
      const user = await this.user.GetUserByToken(req.cookies['TWOFA']);
      const isCodeValid = await this.twofaService.verifyTwoFaToken(
        twofa.twoFaCode,
        user,
      );
      if (!isCodeValid) {
        return { success: false, msg: 'Invalid Code' };
      }
      const token = await this.authService.signToken(user);
      res.cookie('TWOFA', '', { expires: new Date() });
      res.cookie('JWT_TOKEN', token);
      return { success: true };
    }
    else {
      return { success: false, msg: 'Invalid Request' };
    }

    
  }

}
