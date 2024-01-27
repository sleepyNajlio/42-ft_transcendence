import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  // SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketService } from './socket.service';

@WebSocketGateway()
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private server: Server;
  private userSockets: Map<string, Socket[]> = new Map();
  constructor(
    private prisma: PrismaService,
    private socketService: SocketService,
  ) {}

  afterInit(server: Server) {
    this.server = server;
    console.log('Socket.IO server initialized');
    // setInterval(() => {
    //   console.log('userSockets', this.userSockets);
    // }, 7000);
  }

  handleConnection(client: Socket) {
    console.log(
      `Client ${client.id} connected. ${client.handshake.query.userId}`,
    );

    // Extract user ID from query parameter
    const userId = client.handshake.query.userId as string;
    // Associate the user with this socket
    if (!this.userSockets.has(userId)) {
      this.updateStatus(Number(userId), 'ONLINE');
      this.userSockets.set(userId, []);
    }
    this.userSockets.get(userId).push(client);
    // console.log('userSockets', this.userSockets);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected.`);
    // client.emit('disconnectGame');
    // Remove the socket from the user's sockets
    const userId = client.handshake.query.userId as string;
    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      const index = userSockets.indexOf(client);
      if (index !== -1) {
        userSockets.splice(index, 1);
        // If no more sockets are associated with the user, remove the user entry
        if (userSockets.length === 0) {
          this.userSockets.delete(userId);
          this.updateStatus(Number(userId), 'OFFLINE');
        }
        console.log('userSockets', this.userSockets);
      }
    }
  }

  updateStatus(playerId: number, status: string) {
    this.socketService.updateUserStatus(playerId, status).then((res) => {
      this.socketService.getFriends(playerId).then((res) => {
        res.map((friend) => {
          const friendId =
            friend.userId === playerId
              ? friend.friendId.toString()
              : friend.userId.toString();
          const friendSockets = this.userSockets.get(friendId);
          if (friendSockets) {
            friendSockets.map((friendSocket) => {
              friendSocket.emit('status', {
                id_player: playerId,
                status: status,
              });
            });
          }
        });
      });
      console.log('updateUserStatus', res);
    });
  }

  // @SubscribeMessage('logedIn')
  // async handleMessageLogin(client: Socket, data: any) {
  //   // Handle login message logic here
  //   // console.log('Received login message:', data);
  //   // Example: Send a response back to the client
  //   this.clients.set(data.id_player, client);
  //   try {
  //     const updatedPlayer = await this.prisma.player.update({
  //       where: {
  //         username: data.username,
  //       },
  //       data: {
  //         status: 'ONLINE',
  //       },
  //     });

  //     if (!updatedPlayer) {
  //       console.log(`No player found with username: ${data.username}`);
  //     } else {
  //       console.log('Player status updated:', updatedPlayer);
  //     }
  //   } catch (error) {
  //     console.error('Error updating player status:', error);
  //   }
  // }

  getServer(): Server {
    return this.server;
  }
  getClientSocket(playerId: string): Socket[] | undefined {
    const userSockets = this.userSockets.get(playerId);
    return userSockets ? userSockets : undefined;
  }
}
