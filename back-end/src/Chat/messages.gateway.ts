import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Server , Socket } from 'socket.io';

@WebSocketGateway({
  cors : {
    origin : '*' ,// Allow all origins
  },
})
export class MessagesGateway {

  @WebSocketServer() // to be able to send messages to all the clients
  server : Server; // reference to the socket.io server under the hood

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('createMessage') // to be able to send new messages
  async create(@MessageBody() createMessageDto: CreateMessageDto) {
    const message = await this.messagesService.create(createMessageDto);
    
    this.server.emit('message' , message); // emit events to all connected clients

    return message;
  }

  @SubscribeMessage('findAllMessages') // to be able to see the old messages 
  findAll() {
    return this.messagesService.findAll();
  }
  @SubscribeMessage('join')
  joinRoom(){
    // TODO: join the room
  }

}
