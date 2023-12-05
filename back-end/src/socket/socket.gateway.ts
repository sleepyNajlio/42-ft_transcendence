import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway()
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private server: Server;
  private clients: Map<string, Socket> = new Map();
  constructor(private prisma: PrismaService) {}
  afterInit(server: Server) {
    this.server = server;
    console.log('Socket.IO server initialized');
    setInterval(() => {
      this.clients.forEach((socket, key) => {
        console.log(`Client key: ${key}, Socket ID: ${socket.id}`);
      });
    }, 7000);
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client.id);
    console.log(`oh noo Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('logedIn')
  async handleMessageLogin(client: Socket, data: any) {
    // Handle login message logic here
    // console.log('Received login message:', data);
    // Example: Send a response back to the client
    this.clients.set(data.id_player, client);
    try {
      const updatedPlayer = await this.prisma.player.update({
        where: {
          username: data.username,
        },
        data: {
          status: 'ONLINE',
        },
      });

      if (!updatedPlayer) {
        console.log(`No player found with username: ${data.username}`);
      } else {
        console.log('Player status updated:', updatedPlayer);
      }
    } catch (error) {
      console.error('Error updating player status:', error);
    }
  }

  getServer(): Server {
    return this.server;
  }
  getClientSocket(playerId: string): Socket | undefined {
    console.log('getClientSocket ', playerId);
    return this.clients.get(playerId);
  }
}
