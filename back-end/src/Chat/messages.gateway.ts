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
import { subscribe } from 'diagnostics_channel';

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
    const message = await this.messagesService.create(
      createMessageDto,
      client.id,
      id,
    );
    const room = "chat_" + message.chatId;
    
    
    this.socketGateway.getServer().of('/chat').to(room).emit('message', message); // emit events to all connected clients
    
    return message;
  }
  
  @SubscribeMessage('createRoom')
  async creatRoom(
    @MessageBody('id1') id1: number,
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
  )
  {
    // console.log('in gateway -- id: ' + id1 + ' user: ' + name + ' just created the chat');
    return await this.messagesService.createChannel(id1, name, client.id);
  }
  @SubscribeMessage('findAllMessages') // to be able to see the old messages
  async findAll(
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
  ) { 
    console.log('in gateway: ' + name);
    return await this.messagesService.findAll(name);
  }
  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('id') id: number,
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.messagesService.identify(id, name, client.id).then((room) => {
      if (room) {
        client.join("chat_"+ room.id_chat);
        console.log('user: ' + id + ' joined the chat');
        return room;
      }
      else
      {

        console.log(' room does not exist in gateway ');
        return null;
      }
    });
    console.log(' kkkkkkkkkkk ');
    // console.log('user: ' + id);
    // console.log('name: ' + name);
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('name') name: string,
    @MessageBody('isTyping') isTyping: boolean,
    @MessageBody('username') username: string,
    @ConnectedSocket() client: Socket,
  ) {
    const chat = await this.messagesService.findRoom(name);

    const room = "chat_" + chat.id_chat;
    client.broadcast.to(room).emit('typing', { username:username, isTyping: isTyping });

  }
}
