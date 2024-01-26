import { Injectable } from '@nestjs/common';
// import { Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SocketService {
  constructor(private prisma: PrismaService) {}
  // private readonly connectedClients: Map<string, Socket> = new Map();
  // handleConnection(socket: Socket): void {
  //   const clientId = socket.id;
  //   this.connectedClients.set(clientId, socket);
  //   socket.on('disconnect', () => {
  //     this.connectedClients.delete(clientId);
  //   });
  //   // Handle other events and messages from the client
  // }
  // Add more methods for handling events, messages, etc.
  async updateUserStatus(id: number, status: string) {
    console.log('updateUserStatus called : ', typeof id, id, status);
    await this.prisma.player.update({
      where: {
        id_player: id,
      },
      data: {
        status: status as any,
      },
    });
  }
  async getFriends(userId: number) {
    const friends = await this.prisma.friendShip.findMany({
      where: {
        OR: [{ userId: userId }, { friendId: userId }],
        status: 'ACCEPTED',
      },
      include: {
        user: {
          select: {
            id_player: true,
            username: true,
            status: true,
          },
        },
        friend: {
          select: {
            id_player: true,
            username: true,
            status: true,
          },
        },
      },
    });
    return friends;
  }
}
