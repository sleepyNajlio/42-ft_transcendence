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
    console.log('updateUserStatus called : ', id, status);
    await this.prisma.player.update({
      where: {
        id_player: id,
      },
      data: {
        status: status as any,
      },
    });
  }
}
