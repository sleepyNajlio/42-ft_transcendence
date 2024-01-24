import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private reflector: Reflector,
    private authservice: AuthService,
    private Users: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) return true;
    const req = context.switchToHttp().getRequest();
    if (!req.cookies || !req.cookies['JWT_TOKEN']) return false;
    try {
      const payload = await this.jwt.verifyAsync(req.cookies['JWT_TOKEN'], {
        secret: this.config.get('JWT_SECRET'),
      });
      const {
        id_player,
        username,
        email,
        avatar,
        isAuthenticated,
        twoFASecret,
        twofa
      } = await this.Users.findByEmail(payload['email']);
      req['user'] = {
        id_player,
        username,
        email,
        avatar,
        isAuthenticated,
        twoFASecret,
        twofa
      };
    } catch {
      console.log("error!!");
      return false;
    }
    return true;
  }
}
