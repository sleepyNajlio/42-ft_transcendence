import { Controller, Get, Res, Req, SetMetadata } from '@nestjs/common';
import { TwofaService } from './twofa.service';
import { Request, Response } from 'express';

@Controller('2fa')
export class TwofaController {
  constructor(private readonly twofa: TwofaService) {}

  @SetMetadata('isPublic', w true)
  @Get("qr-code")
  async generateQrCode(@Res() res: Response, @Req() req) {
    console.log(req.user);
    const otpAuthUrl = await this.twofa.generateTwoFaSecret(req.user.email);
    return this.twofa.qrCodeStreamPipe(res, otpAuthUrl);
  }

  


  

}
