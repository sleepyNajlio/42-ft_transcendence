import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-42';
import Profile from 'passport-42';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID:
        'u-s4t2ud-f5329f6697b605a87be084fa261e3180978ed83f8593cb0d8f77cb17a7858ad1',
      clientSecret:
        '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',
      callbackURL: '/login/42/return',
      passReqToCallback: true,
    });
  }

  async validate(
    request: { session: { accessToken: string } },
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    cb: (error: any, user?: any, info?: any) => void,
  ): Promise<any> {
    console.log('accessToken', accessToken, 'refreshToken', refreshToken);
    request.session.accessToken = accessToken;
    // In this example, the user's 42 profile is supplied as the user
    // record.  In a production-quality application, the 42 profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile);
  }
}
