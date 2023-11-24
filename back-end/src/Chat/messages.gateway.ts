import { 
  WebSocketGateway, 
  SubscribeMessage, 
  MessageBody, 
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Server , Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { connect } from 'net';


@WebSocketGateway({
  namespace : 'chat' , // to avoid conflicts with other gateways
  cors : true , // to allow cross origin requests
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect   {


  
  @WebSocketServer()  // decorator to get a reference to the socket.io server
  server : Server; // reference to the socket.io server under the hood

  constructor(private readonly messagesService: MessagesService) {}
  handleDisconnect(client: any) {
    delete this.messagesService.clients[client.id]
  }

  handleConnection(client: any, ...args: any[]) {
  }

  @SubscribeMessage('createMessage') // to be able to send new messages
   async create(
    @MessageBody() createMessageDto: CreateMessageDto, 
    @ConnectedSocket() client : Socket) {
    const message = this.messagesService.create(createMessageDto, client.id);
    
    this.server.emit('message' , message); // emit events to all connected clients

    console.log(message);
    return message;
  }

  @SubscribeMessage('findAllMessages') // to be able to see the old messages 
  findAll() {
    return this.messagesService.findAll();
  }
  @SubscribeMessage('join')
  joinRoom(
    @MessageBody('user') user : string ,
    @ConnectedSocket() client : Socket ,
  ){
    console.log(user);
    return this.messagesService.identify(user , client.id);
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping : boolean ,
    @ConnectedSocket() client : Socket ,
  )
  {
    const user = this.messagesService.clients[client.id];
    client.broadcast.emit('typing' , {user: user , isTyping: isTyping});
  }
}
