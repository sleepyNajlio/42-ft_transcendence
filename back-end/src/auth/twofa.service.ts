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

  async genrateTwoFaSecret(id_player: number, email: string): Promise<string> {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(
      email,
      this.config.get('APP_NAME'),
      secret,
    );
    await this.usersService.updateTwoFaSecret(id_player, secret);
    return otpauth;
  }
  async pipeQrCodeStream(stream: Response, otpauth: string) {
    return toFileStream(stream, otpauth);
  }

  async verifyTwoFaToken(twoFaCode: string, user: UserDTO): Promise<boolean> {
    // console.log("verifyTwoFaToken, ", twoFaCode, user.twoFASecret);
    const isValid = authenticator.verify({
      token: twoFaCode,
      secret: user.twoFASecret,
    });
    if (isValid) {
      await this.usersService.updateTwoFaStatus(user.id_player, true);
    }
    return isValid;
  }
}
