import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: '*:*',
})
export class SocketGateway {
  private readonly logger = new Logger(WebSocketGateway.name);
  @WebSocketServer() io: Server;
  private server: Socket;

  constructor(private readonly socketService: SocketService) {}

  // Implement other Socket.IO event handlers and message handlers
}
