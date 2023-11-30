import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class MessagesService {
  public clients = {};

  constructor(
    private prisma: PrismaService,
  
  ){}

  identify(user : string , clientId : string) {
    this.clients[clientId] = user;
    // console.log(this.clients);
    return Object.values(this.clients);
  }

  getClientName(clientId : string){
    return this.clients[clientId];
  }
  async create(createMessageDto: CreateMessageDto, clientId : string) {
    const message = {
      name : this.clients[clientId] ,
      text : createMessageDto.text ,
    }
    console.log("before push" + message)
    // await this.prisma.chatMessage.create({
    //   data :
    //   { 
    //     message : createMessageDto.text,
    //     userId : 1,
    //     chatId : 1
    //   }
    // })
    console.log(await this.prisma.chatMessage.create({
      data :
      { 
        message : createMessageDto.text,
        userId : 1,
        chatId : 3
      }
    }))
    return message;
  }
  async findAll() {

    return await this.prisma.chatMessage.findMany(); // TODO : add a query to select all from the messages table
  }
}
