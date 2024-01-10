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
import { Client } from 'socket.io/dist/client';
import { ChatType } from '@prisma/client';

@WebSocketGateway({
  // namespace: 'chat',
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

  @SubscribeMessage('Friends')
  async DisplayFriends(
    @MessageBody('id') id:number,
    @ConnectedSocket() Client: Socket, 
  )
  {
    const Users = await this.messagesService.getUsers(id);
    // this.socketGateway.getServer().emit('users', Users);
    // console.log('users in gateway : ');
    // console.log(Users);
    return Users;
  }

  @SubscribeMessage('DisplayRoom')
  async displayRoom(
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
      const rooms = await this.messagesService.getRooms(id);
      // this.socketGateway.getServer().emit('rooms', rooms);
      // console.log('rooms in gateway : ');
      // console.log(rooms);
      return rooms;
  }

  @SubscribeMessage('updateRoom')
  async updateRoom(
    @MessageBody('id') id: number,
    @MessageBody('name') name: string,
    @MessageBody('type') type: string,
    @MessageBody('newPass') newPass:  string,
    @MessageBody('modifypass') modifypass: boolean,
    @MessageBody('setPass') setPass: boolean,
    @MessageBody('removepass') removepass: boolean,
  )
  {
    const Rooms = await this.messagesService.updateRoom(id, name,type,newPass,modifypass,setPass,removepass);
    
  //  return await this.messagesService.updateRoom(id, name,type,newPass,modifypass,setPass,removepass);
  }

  @SubscribeMessage('createMessage') // to be able to send new messages
  async create(
    @MessageBody() createMessageDto: CreateMessageDto,
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
    @MessageBody('username') username: string | null,
  ) {
    const message = await this.messagesService.create(
      createMessageDto,
      client.id,
      id,
      username,
    );

    // console.log('message in gateway : ');
    const room = "chat_" + message.chatId;
    console.log('room in gateway : ');
    console.log(room);
    this.socketGateway.getServer().to(room).emit('message', message);

    
    return message;
  }
  
  @SubscribeMessage('createRoom')
  async creatRoom(
    @MessageBody('id1') id1: number,
    @MessageBody('name') name: string,
    @MessageBody('roomType') roomType: ChatType,
    @MessageBody('roomPassword') roomPassword: string,
    @ConnectedSocket() client: Socket,
  )
  {
    console.log('create called');
    // console.log('in gateway -- id: ' + id1 + ' user: ' + name + ' just created the chat');
    const Room = await this.messagesService.createChannel(id1, name,roomType,roomPassword, client.id);
    
    console.log('created room in gateway : ');
    console.log(Room);
    
    if (Room)
    {
      if (Room.type == 'PRIVATE')
        this.socketGateway.getServer().to(client.id).emit('rooms', Room);
      else
        this.socketGateway.getServer().emit('rooms', Room);
    }
    else
      return false;
    // return Room;
  }
  @SubscribeMessage('findAllMessages') // to be able to see the old messages
  async findAll(
    @MessageBody('name') name: string,
    @MessageBody('id') id: number,
    @MessageBody('username') username: string | null,
    @ConnectedSocket() client: Socket,
  ) { 
    return await this.messagesService.findAll(name, id, username);
  }
  @SubscribeMessage('join')
  async joinRoom(
    @MessageBody('id') id: number,
    @MessageBody('name') name: string,
    @MessageBody('type') selectedType: string,
    @MessageBody('selectedPswd') selectedPswd: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('selcted pswd in gateway : ');
    console.log(selectedPswd)
    console.log('room name in gateway : ');
    console.log(name);
    console.log('room type in gateway : ');
    console.log(selectedType);
    const room = await this.messagesService.identify(id, name,selectedType,selectedPswd,client.id);
    // console.log('room in gateway : ');
    // console.log(room);
    if (room) {
      client.join("chat_"+ room.id_chat);
      console.log('user: ' + id + ' joined the chat');
      return room;
    }
   return false;
  }
  @SubscribeMessage('joinDm')
  async joinDm(
    @MessageBody('id') id: number,
    @MessageBody('name') name: string,
    @MessageBody('username') username: string,
    @ConnectedSocket() client: Socket,
  ) {

    console.log('the user with id ' + id +' and name  ' + username + ' wants to join the dm with ' + name);

    const room = await this.messagesService.identifyDm(id, name,username,client.id);
    client.join("chat_"+ room.id_chat);
    console.log('user: ' + username + ' joined the chat with ' + name + ' in ' + room.id_chat);
    return room;
  }

  // @SubscribeMessage('typing')
  // async typing(
  //   @MessageBody('name') name: string,
  //   @MessageBody('isTyping') isTyping: boolean,
  //   @MessageBody('username') username: string,
  //   @ConnectedSocket() client: Socket,
  // ) {
  //   console.log('typing called');
  //   console.log(name);
  //   const chat = await this.messagesService.findRoom(name);

  //   const room = "chat_" + chat.id_chat;
  //   client.broadcast.to(room).emit('typing', { username:username, isTyping: isTyping });
    
  // }
}
