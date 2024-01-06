// src/auth/fortytwo.strategy.ts

import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { default as Strategy } from 'passport-42';
import { ConfigService } from '@nestjs/config';
import { Profile } from 'passport';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';

interface profile extends Profile {
  id: string;
  provider: string;
  username: string;
  displayName: string;
  name: {
    familyName: string;
    givenName: string;
  };
  profileUrl: string;
  phoneNumbers: string;

  _raw: string;
  _json: any;
}

@Injectable()
export class FTStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('42_UID'),
      clientSecret: configService.get<string>('42_SECRET'),
      callbackURL: configService.get<string>('42_CALLBACK_URI'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: profile,
    cb: any,
  ): Promise<any> {
    // Add your logic to validate or create a user based on the profile data
    console.log('FTStrategy validate begin');
    const user = await this.authService.validateUser({
      username: profile.username,
      email: profile.emails[0].value,
      avatar: profile._json.image.link,
    });
    if (user) cb(null, user);
    else cb(null, false);
  }
}
