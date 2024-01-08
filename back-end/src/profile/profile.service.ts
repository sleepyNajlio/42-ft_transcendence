import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getUserInfoFromToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      // Here, you can fetch user data based on the decoded JWT token payload
      // Example: Fetch user data from the database using `decoded.sub` or `decoded.username`
      // console.log(decoded);
      const user = await this.prisma.player.findUnique({
        where: {
          username: decoded.username,
        },
      });
      return user;
    } catch (error) {
      throw new Error('Invalid token'); // Handle token verification errors
    }
  }

  async getAllUsers(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
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

  async getUserById(id: number) {
    const user = await this.prisma.player.findUnique({
      where: {
        id_player: id,
      },
    });
    return user;
  }

  // async getUsersRank() {
  //   const players = await this.prisma.player.findMany({
  //     include: {
  //       games: true,
  //     },
  //   });
  //   return players;
  // }
  // getUsersRankId(arg0: number) {
  //   throw new Error('Method not implemented.');
  // }
}
