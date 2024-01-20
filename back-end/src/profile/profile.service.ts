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
          email: decoded.email,
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
            email: decoded.email,
          },
        },
      });
      return user;
    } catch (error) {
      throw new Error('Invalid token'); // Handle token verification errors
    }
  }

  async getUserById(id: number) {
    try {
      const user = await this.prisma.player.findUnique({
        where: {
          id_player: id,
        },
      });
      return { user: user };
    } catch (error) {
      throw new Error('Invalid token'); // Handle token verification errors
    }
  }

  async getMatchStats(id: number) {
    const stats = await this.prisma.userGame.findMany({
      where: {
        gameId: id,
      },
      include: {
        user: {
          select: {
            avatar: true,
          },
        },
      },
    });
    console.log(stats);
    return stats;
  }

  async getMatchHistory(id: number) {
    const matches = await this.prisma.userGame.findMany({
      where: {
        userId: id,
      },
      include: {
        user: true,
        game: true,
      },
      orderBy: {
        game: {
          createdAt: 'desc',
        },
      },
      take: 10,
    });

    const matches2: {
      score1: number;
      user2: string;
      score2: number;
      createdat: Date;
    }[] = [];

    await Promise.all(
      matches.map(async (match) => {
        try {
          const res = await this.prisma.userGame.findFirst({
            where: {
              gameId: match.gameId,
              NOT: {
                userId: id,
              },
            },
            include: {
              user: true,
            },
          });

          if (res) {
            matches2.push({
              score1: match.score,
              user2: res.user.avatar,
              score2: res.score,
              createdat: match.game.createdAt,
            });
          }
        } catch (err) {
          console.log(err);
        }
      }),
    );

    // Sort matches2 by time
    matches2.sort((a, b) => b.createdat.getTime() - a.createdat.getTime());

    return matches2;
  }

  async getUsersRankId(id: number) {
    const players = await this.prisma.player.findMany({
      orderBy: {
        wins: 'desc',
      },
    });
    const playerIndex = players.findIndex((player) => player.id_player === id);
    return playerIndex + 1;
  }
  // getUsersRankId(arg0: number) {
  //   throw new Error('Method not implemented.');
  // }
  async getUsersRank() {
    const players = await this.prisma.player.findMany({
      orderBy: {
        wins: 'desc',
      },
    });
    // const filteredPlayers = players.filter((player) => player.loses > 0);

    const rankedPlayers = players.map((player) => ({
      ...player,
      ratio: player.wins / player.loses,
    }));
    console.log('rankkk', rankedPlayers);
    return rankedPlayers;
  }
  async updateUser(id: number, avatar: string, username: string) {
    const user = await this.prisma.player.update({
      where: {
        id_player: id,
      },
      data: {
        avatar: avatar,
        username: username,
      },
    });
    return user;
  }
}
