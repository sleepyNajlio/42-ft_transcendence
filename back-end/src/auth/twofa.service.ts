import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { TwoFaDTO } from 'src/users/dto/SignUp.dto';
import { Response } from 'express';
import { toFileStream } from 'qrcode';


@Injectable()
export class TwofaService {
    constructor(
        private readonly usersService: UsersService,
        private readonly config: ConfigService,
    ) {}
    
    async genrateTwoFaSecret(id_player: number, email: string): Promise<string> {
        const secret = authenticator.generateSecret();
        const otpauth = authenticator.keyuri(email, this.config.get('APP_NAME'), secret);
        await this.usersService.updateTwoFaSecret(id_player, secret);
        return otpauth;
    }

    async pipeQrCodeStream(stream: Response, otpauth: string) {
        return toFileStream(stream, otpauth);
    }
}


