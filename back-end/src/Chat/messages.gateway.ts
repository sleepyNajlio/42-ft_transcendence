import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';
import { SocketGateway } from 'src/socket/socket.gateway';

@WebSocketGateway({
  namespace: 'chat',
  cors: '*:*',
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private server: Server;
  constructor(
    private readonly messagesService: MessagesService,
    private readonly socketGateway: SocketGateway,
  ) {}

  handleDisconnect(client: any) {
    delete this.messagesService.clients[client.id];
  }

  async handleConnection(client: any, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('createMessage') // to be able to send new messages
  async create(
    @MessageBody() createMessageDto: CreateMessageDto,
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    console.log("in gateway: ");
    console.log(id);
    const message = await this.messagesService.create(
      createMessageDto,
      client.id,
      id,
    );

    this.socketGateway.getServer().of('/chat').emit('message', message); // emit events to all connected clients

    return message;
  }

  @SubscribeMessage('findAllMessages') // to be able to see the old messages
  async findAll() {
    return await this.messagesService.findAll();
  }
  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('id') id: number,
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
  ) {
    // console.log('user: ' + id);
    // console.log('name: ' + name);
    return this.messagesService.identify(id, name, client.id);
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const user = this.messagesService.clients[client.id];
    client.broadcast.emit('typing', { user: user, isTyping: isTyping });
  }
}
