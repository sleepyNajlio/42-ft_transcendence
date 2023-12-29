import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-42';
import { Profile } from 'passport';
import { AuthService } from './auth.service';




@Injectable()
export class FTStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private config: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: config.get('42_UID'),
      clientSecret: config.get('42_SECRET'),
      callbackURL: config.get('42_CALLBACK_URI'),
      // Scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log("42 strategy validate");
    let user = await this.authService.findUser(profile.emails[0].value);
    if (!user) {
      await this.authService.signup({
        email: profile.emails[0].value,
        username: profile.username,
        avatar: profile.photos[0].value,
      });
      user = await this.authService.findUser(profile.emails[0].value);
    }
    console.log(user);
    return user ;
  }
}
