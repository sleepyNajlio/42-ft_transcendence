import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { UserDTO } from 'src/users/dto/SignUp.dto';
import { Response } from 'express';
import { toFileStream } from 'qrcode';
import { Console } from 'console';

@Injectable()
export class TwofaService {
  constructor(
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  async genrateTwoFaSecret(id_player: number): Promise<string> {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(
      "achrafmoubarekpro@gmail.com",
      this.config.get('APP_NAME'),
      secret,
    );
    await this.usersService.updateTwoFaSecret(id_player, secret);
    return otpauth;
  }

  async pipeQrCodeStream(stream: Response, otpauth: string) {
    return toFileStream(stream, otpauth);
  }

  async verifyTwoFaToken(twoFaCode: string, id: string): Promise<boolean> {
    // console.log("verifyTwoFaToken, ", twoFaCode, user.twoFASecret);
    const tfs: string = await this.usersService.getSecretWithId(Number(id));
    console.log('twooofaaasecreeeeet',tfs);
    const isValid = authenticator.verify({
      token: twoFaCode,
     secret: tfs,
    });
    if (isValid) {
      await this.usersService.updateTwoFaStatus(Number(id), true);
    }
    return isValid;
  }
}
