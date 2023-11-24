import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {

  messages : Message[] = [ {name : 'Fahid' , text : 'Wach Wach!'} ];
  clients = {};

  identify(user : string , clientId : string) {

    this.clients[clientId] = user;
    // console.log(this.clients);
    return Object.values(this.clients);
  }

  getClientName(clientId : string){
    return this.clients[clientId];
  }
  create(createMessageDto: CreateMessageDto, clientId : string) {
    const message = {
      name : this.clients[clientId] ,
      text : createMessageDto.text ,
    }
    this.messages.push(message); // TODO : improve this method
    // console.log(this.messages);
    return message;
  }
  findAll() {
    return this.messages; // TODO : add a query to select all from the messages table
  }
}
