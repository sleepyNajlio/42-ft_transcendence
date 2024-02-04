import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RelationStatus } from '@prisma/client';
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
      const user = await this.prisma.player.findUnique({
        where: {
          email: decoded.email,
        },
      });
      return user;
    } catch (error) {
      throw new HttpException('invalid Token', HttpStatus.OK); // Handle token verification errors
    }
  }

  async addFriend(id: number, invId: number) {
    try
    {
      const status = await this.getFriendStatus(id, invId);
      if (status === 'error') {
        return 'Invalid Request';
      }
      if (!status) {
        const zbi = await this.prisma.friendShip.create({
          data: {
            userId: id,
            friendId: invId,
          },
        });
        return zbi;
      } else if (status.status === 'REJECTED') {
        const zbi = await this.prisma.friendShip.update({
          where: {
            userId_friendId: {
              userId: status.userId,
              friendId: status.friendId,
            },
          },
          data: {
            userId: id,
            friendId: invId,
            status: 'PENDING',
          },
        });
        return zbi;
      }
    }
    catch {
      return 'Invalid Request';
    }
  }

  async updateStatus(id: number, invId: number, statusStr: string) {
    try {
      const status = await this.getFriendStatus(id, invId);
      if (status === 'error') {
        return 'Invalid Request';
      }
      if (!status && statusStr !== 'ACCEPTED') {
        const zbi = await this.prisma.friendShip.create({
          data: {
            userId: id,
            friendId: invId,
            status: statusStr as RelationStatus, // Cast statusStr to RelationStatus
          },
        });
        return zbi;
      } else {
        const zbi = await this.prisma.friendShip.update({
          where: {
            userId_friendId: {
              userId: status.userId,
              friendId: status.friendId,
            },
          },
          data: {
            status: statusStr as RelationStatus,
          },
        });
        return zbi;
      }
    }
    catch {
      return 'Invalid Request';
    }
  }

  async getAllUsers(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      // Here, you can fetch user data based on the decoded JWT token payload
      // Example: Fetch user data from the database using `decoded.sub` or `decoded.username`
      const user = await this.prisma.player.findMany({
        where: {
          NOT: {
            email: decoded.email,
          },
        },
      });
      return user;
    } catch (error) {
      return 'Invalid Token';
    }
  }

  async getNotBockedUsers(id: number) {
    try
    {
      const users = await this.prisma.player.findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  AND: [
                    {
                      friendshipAsked: {
                        none: {
                          OR: [{ userId: id }, { friendId: id }],
                        },
                      },
                    },
                    {
                      friendshipReceived: {
                        none: {
                          OR: [{ userId: id }, { friendId: id }],
                        },
                      },
                    },
                  ],
                },
                {
                  OR: [
                    {
                      friendshipAsked: {
                        some: {
                          AND: [
                            {
                              OR: [{ userId: id }, { friendId: id }],
                            },
                            { NOT: { status: 'BLOCKED' } },
                          ],
                        },
                      },
                    },
                    {
                      friendshipReceived: {
                        some: {
                          AND: [
                            {
                              OR: [{ userId: id }, { friendId: id }],
                            },
                            { NOT: { status: 'BLOCKED' } },
                          ],
                        },
                      },
                    },
                  ],
                },
              ],
            },
            {
              NOT: {
                id_player: id,
              },
            },
          ],
        },
      });
      return users;
    }
    catch {
      return 'error';

    }
  }
  async getBockedUsers(id: number) {
    try
    {
      const users = await this.prisma.player.findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  friendshipAsked: {
                    some: {
                      AND: [
                        {
                          OR: [{ userId: id }, { friendId: id }],
                        },
                        { status: 'BLOCKED' },
                      ],
                    },
                  },
                },
                {
                  friendshipReceived: {
                    some: {
                      AND: [
                        {
                          OR: [{ userId: id }, { friendId: id }],
                        },
                        { status: 'BLOCKED' },
                      ],
                    },
                  },
                },
              ],
            },
            {
              NOT: {
                id_player: id,
              },
            },
          ],
        },
      });
      return users;
    }
    catch {
      return 'error';
    }
  }

  async getNotFriend(id: number) {
    try
    {
      const users = await this.prisma.player.findMany({
        where: {
          AND: [
            {
              NOT: {
                OR: [
                  {
                    friendshipReceived: {
                      some: {
                        friendId: id,
                        status: 'PENDING',
                      },
                    },
                  },
                  // in friendshipAsked add -> status: 'PENDING', decline -> status: 'REJECTED', accept -> status: 'ACCEPTED', block -> status: 'BLOCKED'
                  {
                    friendshipAsked: {
                      some: {
                        friendId: id,
                        status: 'PENDING',
                      },
                    },
                  },
                ],
              },
            },
            {
              NOT: {
                id_player: id,
              },
            },
          ],
        },
      });
      return users;
    }
    catch {
      return 'error';
    }
  }

  async getFriendStatus(id_player: number, id_player1: number) {
    try{
      const friendStatus = await this.prisma.friendShip.findFirst({
        where: {
          OR: [
            {
              userId: id_player,
              friendId: id_player1,
            },
            {
              userId: id_player1,
              friendId: id_player,
            },
          ],
        },
      });
      return friendStatus;
    }
    catch {
      return 'error';
    }
  }

  async getUserById(id: number) {
    try {
      const user = await this.prisma.player.findUnique({
        where: {
          id_player: id,
        },
      });
      return user;
    } catch (error) {
      return 'error';
    }
  }

  async getMatchStats(id: number) {
    try
    {
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
      return stats;
    }
    catch {
      return 'error';
    }
  }

  async getMatchHistory(id: number) {
    try
    {
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
        user1: string;
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
                user1: match.user.avatar,
                score1: match.score,
                user2: res.user.avatar,
                score2: res.score,
                createdat: match.game.createdAt,
              });
            }
          } catch (err) {
          }
        }),
      );

      // Sort matches2 by time
      matches2.sort((a, b) => b.createdat.getTime() - a.createdat.getTime());

      return matches2;
    }
    catch {
      return 'error';
    }
  }

  async getUsersRankId(id: number) {
    try
    {
      const players = await this.prisma.player.findMany({
        orderBy: {
          wins: 'desc',
        },
      });
      const playerIndex = players.findIndex((player) => player.id_player === id);
      return playerIndex + 1
    }
    catch {
      return 'error';
    }
  }
  // getUsersRankId(arg0: number) {
  //   throw new Error('Method not implemented.');
  // }
  async getUsersRank() {
    try
    {
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
      return rankedPlayers;
    }
    catch {
      return 'error';
    }
  }
  async updateUser(id: number, avatar: string, username: string) {
    try
    {
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
    catch {
      return 'error';
    }
  }
}
