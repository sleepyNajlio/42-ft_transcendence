import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { ConfigService } from '@nestjs/config';
import { ProfileService } from 'src/profile/profile.service';
import { Response } from 'express';
import { toFileStream } from 'qrcode';

@Injectable()
export class TwofaService {
  constructor(private config: ConfigService,
    private profile: ProfileService) {}

  async generateTwoFaSecret(mail: string) {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(
      mail,
      this.config.get('APP_NAME'),
      secret,
    );
    await this.profile.setTwoFaSecret(secret, mail);
    return otpauthUrl;
  }

  async qrCodeStreamPipe(res: Response, otpauthUrl: string) {
    res.setHeader('Content-type', 'image/png');
		return toFileStream(res, otpauthUrl);
	}
}
