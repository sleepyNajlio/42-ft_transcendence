import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto, 
        createRoomDto,
        updatedRoomDto,
      selectedPswdDto} from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';
import { SocketGateway } from 'src/socket/socket.gateway';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

type updatedRoom = {
  name: string;
  newPass: string | null;
  type: string;
  id: number;
  Role: string;
  userId : number;
};

const config = new ConfigService();

@WebSocketGateway({
  namespace: '/',
  cors: {
    origin: config.get('FRONTEND_URL'),
  },
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
    this.messagesService.clients[client.id] = client;
  }

  @SubscribeMessage('Friends')
  async DisplayFriends(@MessageBody('id') id: number) {
    try {
      const Users = await this.messagesService.getUsers(id);
      // this.socketGateway.getServer().emit('users', Users);
      return Users;
    }
    catch
    {
      return "error";
    }
  }

  @SubscribeMessage('DisplayRoom')
  async displayRoom(@MessageBody('id') id: number) {
    try
    {
      const rooms = await this.messagesService.getRooms(id);
      return rooms;
    }
    catch
    {
      return "error";
    }
    // this.socketGateway.getServer().emit('rooms', rooms);
  }

  @SubscribeMessage('updateRoom')
  async updateRoom(
    @MessageBody() updatedRoomDto : updatedRoomDto,
  ) {
    // const paswd : string | null = newPass || null;
    // const newtype : ChatType = type as ChatType;
    // const role : string = 'ADMIN';
    try
    {
      let hashedPassword = null;
      const {id, name, type, newPass, modifypass, setPass, removepass} = updatedRoomDto;
      if (newPass) {
        hashedPassword = await bcrypt.hash(newPass, 10);
        // Now update the room in the database with the hashed password
      }
      const Room = await this.messagesService.updateRoom(
        id,
        name,
        type,
        hashedPassword,
        modifypass,
        setPass,
        removepass,
      );

      const room: updatedRoom = {
        name: Room.name,
        newPass: Room.password ? Room.password : null,
        type: Room.type,
        id: Room.id_chat,
        Role: Room.users[0].role,
        userId : id,

      };

      this.socketGateway.getServer().emit('update', room);
      return room;
    } catch {
      return "error";
    }

    //  return await this.messagesService.updateRoom(id, name,type,newPass,modifypass,setPass,removepass);
  }

  @SubscribeMessage('createMessage') // to be able to send new messages
  async create(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    try
    {
      const message = await this.messagesService.create(
        createMessageDto,
        client.id,
      );
        
      if (!message) return false;
      const room = 'chat_' + message.chatId;
      this.socketGateway.getServer().to(room).emit('message', message);
  
      return message;
    }
    catch
    {
      return "error";
    }
  }

  @SubscribeMessage('createRoom')
  async creatRoom(
    @MessageBody() createRoomDto : createRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    try{
      const {id1, name, roomType, roomPassword} = createRoomDto;
      let hashedPassword = null;
      if(roomPassword)
        hashedPassword = await bcrypt.hash(roomPassword, 10);
      const Room = await this.messagesService.createChannel(
        id1,
        name,
        roomType,
        hashedPassword,
      );
  
  
      if (Room) {
        if (Room.type == 'PRIVATE')
          this.socketGateway.getServer().to(client.id).emit('rooms', Room);
        else this.socketGateway.getServer().emit('rooms', Room);
      } else return false;
    } 
    catch
    {
      return "error";
    }
  }
  @SubscribeMessage('findAllMessagesDm') // to be able to see the old messages
  async findAll(
    @MessageBody('name') name: string,
    @MessageBody('id') id: number,
    @MessageBody('username') username: string | null,
    // @ConnectedSocket() client: Socket,
  ) {
    try{
      const messages =  await this.messagesService.findAllDm(name, id, username);
      return messages;
    }
    catch
    {
      return "error";
    }
  }

  @SubscribeMessage('findAllMessages')
  async findAllMessages(
    @MessageBody('name') name: string,
    @MessageBody('id') id: number,
    @ConnectedSocket() client: Socket,
  ) {
    try{
      const messages = await this.messagesService.findAllMessages(name, id);
      return messages;
    }
    catch
    {
      return "error";
    }
  }

  @SubscribeMessage('join')
  async joinRoom(
    @MessageBody('id') id: number,
    @MessageBody('name') name: string,
    @MessageBody('type') selectedType: string,
    @MessageBody() selectedPswdDto: selectedPswdDto,
    @ConnectedSocket() client: Socket,
  ) {
    try{
      const {selectedPswd} = selectedPswdDto;
      const room = await this.messagesService.identify(
        id,
        name,
        selectedType,
        selectedPswd,
      );
      if (room) {
        client.join('chat_' + room.id_chat);
        return room;
      }
      return false;
    }
    catch
    {
      return "error";
    }
  }

  @SubscribeMessage('getChatUsers')
  async getChatUsers(
    @MessageBody('name') name: string,
    @MessageBody('id') id: number,
  ) {
    try{
      const users = await this.messagesService.getChatUsers(name, id);
      return users;
    }
    catch
    {
      return "error";
    }
  }

  @SubscribeMessage('setAdmin')
  async setAdmin(
    @MessageBody('id') id: number,
    @MessageBody('username') username: string,
    @MessageBody('name') name: string,
  ) {
    try{
      const room = await this.messagesService.setAdmin(id, username, name);
      this.socketGateway.getServer().emit('Admin', room);
      return room;
    }
    catch
    {
      return "error";
    }
  }

  @SubscribeMessage('addUser')
  async addUser(
    @MessageBody('id') id: number,
    @MessageBody('username') username: string,
    @MessageBody('name') name: string,
  ) {
    try{
      const room = await this.messagesService.addUser(id, username, name);
      if (room)
      {
        this.socketGateway.getServer().emit('onadd', room);
        return room;
      }
      else
        return false;
    }
    catch
    {
      return "error";
    }
  }

  @SubscribeMessage('kick')
  async kick(
    @MessageBody('id') id: number,
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
  ) {
    try
    {
      this.socketGateway.getClientSocket(id.toString())?.map((socketa) => {
        // if (socketa.id !== client.id) {
          // socketa.leave('chat_' + id);
        // }
      });
      // Log all client IDs
      const room = await this.messagesService.kick(id, name);
      if (room) {
        this.socketGateway.getServer().emit('onkick', room);
        return room;
      } else {
        return false;
      }
    }
    catch
    {
      return "error";
    }
  }

@SubscribeMessage('ban')
async ban(
  @MessageBody('id') id: number,
  @MessageBody('name') name: string,
  @ConnectedSocket() client: Socket,
) {
  try{
    const room = await this.messagesService.ban(id, name);
    if (room) {
      this.socketGateway.getServer().emit('onban', room);
      return room;
    }
    else {
      return false;
    }
  }
  catch
  {
    return "error";
  }
}

@SubscribeMessage('mute')
async mute(
  @MessageBody('id') id: number,
  @MessageBody('name') name: string,
  @ConnectedSocket() client: Socket,
) {
  try{
    const room = await this.messagesService.mute(id, name);
    if (room) {
      this.socketGateway.getServer().emit('onmute', room);
      return room;
    }
    else {
      return false;
    }
  }
  catch
  {
    return "error";
  }
}


  @SubscribeMessage('leave')
  async leave(
    @MessageBody('id') id: number,
    @MessageBody('name') name: string,
    @ConnectedSocket() client: Socket,
  ) {
    try{
      const room = await this.messagesService.leave(id, name);
      client.leave('chat_' + room.chatId);
      this.socketGateway.getServer().emit('onleave', room);
      return room;
    }
    catch
    {
      return "error";
    }
  }

  @SubscribeMessage('joinDm')
  async joinDm(
    @MessageBody('id') id: number,
    @MessageBody('name') name: string,
    @MessageBody('username') username: string,
    @ConnectedSocket() client: Socket,
  ) {
    try
    {
      const room = await this.messagesService.identifyDm(id, name, username);
      client.join('chat_' + room.id_chat);
      return room;
    }
    catch
    {
      return "error";
    }
  }
}
