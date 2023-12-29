import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { authDTO, signinDTO, signupDTO } from '../dto';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: authDTO) {
    // console.log(dto);
    try {
      await this.prisma.player.create({
        data: {
          email: dto.email,
          username: dto.username,
          avatar: dto.avatar,
          isAuthenticated: false,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'An account with email or username already exists',
          );
        }
      }
    }
  }

  async signin(dto: signinDTO): Promise<{ accessToken: string }> {
    console.log('helllooooo');
    const player = await this.prisma.player.findFirst({
      where: {
        username: dto.username,
      },
    });
    if (!player) throw new ForbiddenException('username or password incorrect');
    if (!player.isAuthenticated)
      throw new ForbiddenException('Unauthenticated User');
    // const pwMatch = await argon.verify(player.hash, dto.password);
    // if (!pwMatch)
    //   throw new ForbiddenException('username or password incorrect');
    return this.signToken(player.id_player, player.username);
  }

  async finish_signup(dto: signupDTO, UserToken: string) {
    if (!UserToken) throw new UnauthorizedException('Invalid Request');
    try {
      await this.jwtService.verifyAsync(UserToken, {
        secret: this.config.get('JWT_SECRET'),
      });
    } catch {
      throw new UnauthorizedException();
    }
    let player = await this.findUser(dto.email);
    if (!player)
      throw new ForbiddenException('you need to signup with intra first');
    if (player.isAuthenticated)
      throw new ForbiddenException('User Already Authenticated ');
    await this.prisma.player.updateMany({
      where: {
        email: dto.email,
      },
      data: {
        username: dto.username,
        isAuthenticated: true,
      },
    });
    player = await this.findUser(dto.email);
    return this.signToken(player.id_player, player.username);
  }

  async saveAvatar(userToken: string, file: Express.Multer.File) {
    try {
      const payload = await this.jwtService.verifyAsync(userToken, {
        secret: this.config.get('JWT_SECRET'),
      });
      await this.prisma.player.updateMany({
        where: {
          email: payload.email,
        },
        data: {
          avatar: file.path,
        },
      });
    } catch {
      throw new UnauthorizedException();
    }
  }

  async signToken(
    userID: number,
    username: string,
  ): Promise<{ accessToken: string }> {
    const payload = { sub: userID, username };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async findUser(email: string) {
    const user = await this.prisma.player.findFirst({
      where: {
        email: email,
      },
    });
    return user;
  }
}
