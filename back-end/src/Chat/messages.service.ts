import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class MessagesService {
  PrismaClient = new PrismaClient();

  // messages : Message[] = [ {name : 'Fahid' , text : 'Wach Wach!'} ];
  clients = {};

  identify(user : string , clientId : string) {

    this.clients[clientId] = user;
    // console.log(this.clients);
    return Object.values(this.clients);
  }

  getClientName(clientId : string){
    return this.clients[clientId];
  }
  create(createMessageDto: CreateMessageDto, clientId: string) {
    const message = {
      name: this.clients[clientId],
      text: createMessageDto.text,
    };
  //   const createdChat =  this.PrismaClient.chat.create({
  // data: {
  //   // your chat data here
  //   messages: {
  //     create: {
  //       // your message data here
  //     },
    },
  },
});

    // const createdMessage = this.PrismaClient.chat.create({
    //   data: {
    //     name: message.name,
    //   },
    // });
    // console.log(createdMessage);


    // console.log(createdMessage);
    return message;
  }
  findAll() {
    return this.PrismaClient.message.findMany(); // Query to select all messages
  }

}
