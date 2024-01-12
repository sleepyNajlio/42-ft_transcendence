import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SignUpDTO, FinishSignUpDTO } from './dto/SignUp.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  // async findByUsername(username: string) {
  //   const user = await this.prisma.player.findUnique({
  //     where: { username: username },
  //   });
  //   // if (!user) return new HttpException('User not found', HttpStatus.NOT_FOUND);
  //   return user;
  // }

  async findByEmail(email: string) {
    const user = await this.prisma.player.findUnique({
      where: { email: email },
    });
    // if (!user) return new HttpException('User not found', HttpStatus.NOT_FOUND);
    return user;
  }

  async signUp(SignUpDTO: SignUpDTO) {
    const userExists = await this.prisma.player.findUnique({
      where: { email: SignUpDTO.email },
    });
    if (userExists) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    const user = await this.prisma.player.create({
      data: SignUpDTO,
    });

    return user;
  }

  async finishSignUp(dto: SignUpDTO) {
    let userExists = await this.prisma.player.findUnique({
      where: { email: dto.email },
    });
    if (userExists.isAuthenticated) {
      throw new HttpException(
        'User already authenticated',
        HttpStatus.CONFLICT,
      );
    }
    userExists = await this.updateProfile({
      email: dto.email,
      username: dto.username,
      avatar: dto.avatar,
      isAuthenticated: true,
    });
    return userExists;
  }

  // async findAll() {
  //   const users = await this.prisma.player.findMany();
  //   return users;
  // }

  async getUserById(id: number) {
    const user = await this.prisma.player.findUnique({
      where: {
        id_player: id,
      },
    });
    return user;
  }

  async getAllUsers(token: string) {
    try {
      const decoded = this.jwt.verify(token);
      // Here, you can fetch user data based on the decoded JWT token payload
      // Example: Fetch user data from the database using `decoded.sub` or `decoded.username`
      // console.log(decoded);
      const user = await this.prisma.player.findMany({
        where: {
          NOT: {
            username: decoded.username,
          },
        },
      });
      return user;
    } catch (error) {
      throw new Error('Invalid token'); // Handle token verification errors
    }
  }

  async updateProfile(FinishSignUpDTO: FinishSignUpDTO) {
    const userExists = await this.prisma.player.findUnique({
      where: { email: FinishSignUpDTO.email },
    });
    if (!userExists) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    const user = await this.prisma.player.update({
      where: { email: FinishSignUpDTO.email },
      data: FinishSignUpDTO,
    });
    return user;
  }

  async GetUserByToken(token: string) {
    // console.log("token: ", token);
    const payload = this.jwt.verify(token);
    // console.log("payload: ", payload);
    const user = await this.prisma.player.findUnique({
      where: { email: payload.email },
    });
    if (!user) {
      throw new HttpException('invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
