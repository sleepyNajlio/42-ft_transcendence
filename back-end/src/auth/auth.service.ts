import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDTO } from 'src/users/dto/SignUp.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private UsersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async validateUser(profile: SignUpDTO): Promise<any> {
    try{
      let user = await this.UsersService.findByEmail(profile.email);
      if (!user) {
        await this.UsersService.signUp({
          username: profile.username,
          email: profile.email,
          avatar: profile.avatar,
        });
        user = await this.UsersService.findByEmail(profile.email);
      }
      return user;
    }
    catch{
      throw new UnauthorizedException();
    }
  }

  async signToken(user: any) {
    try{
      const payload = { sub: user.id_player, email: user.email };
      const access_token = this.jwtService.sign(payload);
      return access_token;
    }
    catch{
      throw new UnauthorizedException();
    }
  }

  async finish_signup(dto: SignUpDTO, UserToken: string) {
    if (!UserToken) throw new UnauthorizedException('Invalid Request');
    try {
      await this.jwtService.verifyAsync(UserToken, {
        secret: this.config.get('JWT_SECRET'),
      });
      const user = await this.UsersService.finishSignUp({
        email: dto.email,
        username: dto.username,
        avatar: dto.avatar,
      });
      return this.signToken({ email: user.email });
    } catch {
      throw new UnauthorizedException();
    }
  }
}
