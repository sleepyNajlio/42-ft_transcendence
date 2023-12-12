import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
// import { getUser } from 'src/player';

type ChatMessageUncheckedCreateInput = Prisma.ChatMessageUncheckedCreateInput;
type ChatWhereInput = Prisma.ChatWhereInput;


@Injectable()
export class MessagesService {
  public clients = {};

  constructor(private prisma: PrismaService) {}

  

  async identify(id: number, name: string, clientId: string) {
    let chatUSers : any = null;
    
    const existingChat = await this.prisma.chat.findFirst({
      where: {
        name: {
          equals: name,
        },
      } as ChatWhereInput,
    });
    
    if (existingChat) {
      chatUSers = await this.prisma.chatUser.findFirst({
        where: {
          chatId: existingChat.id_chat,
          userId: id,
        },
      });
  
      if (!chatUSers) {
         chatUSers = await this.prisma.chatUser.create({
           data: {
            chatId: existingChat.id_chat,
            userId: id,
          },
        });
      }
    }
    else{
      console.log('id: ' + id + ' user: ' + name + ' cant join the chat');
      return false;
    }

    console.log('id: ' + id + ' user: ' + name + ' joined the chat');
    
    console.log(existingChat);
    console.log('-------------------');
    console.log(chatUSers);
    return existingChat;
  }
  async createChannel(id: number, name: string, clientId: string) {
    console.log('id: ' + id + ' user: ' + name + ' just careated a channel');
    const existingChat = await this.prisma.chat.findFirst({
      where: {
        name: {
          equals: name,
        },
      } as ChatWhereInput,
    });

    if (existingChat) {
      return false;
    }

    const newChat = await this.prisma.chat.create({
      data: {
        name: name,
      },
    });

    const chatUSers = await this.prisma.chatUser.create({
      data: {
        chatId: newChat.id_chat,
        userId: id,
        role: 'ADMIN',
      },
    });

    console.log(newChat);
    console.log('-------------------');
    console.log(chatUSers);
    // return Object.values(this.clients);
    

  
  
  }

  getClientName(clientId: string) {
    return this.clients[clientId];
  }
  async create(createMessageDto: CreateMessageDto, clientId: string, id: number) {
    
    // console.log(createMessageDto.);

    const message = {
      name: createMessageDto.name,
      text: createMessageDto.text,
    }

    const chat = await this.prisma.chat.findFirst({
      where: {
        name: message.name,
      },
    });

    
    const createdChatMessage = await this.prisma.chatMessage.create({
      data: {
        message: message.text,
        chatId: chat.id_chat as number,
        userId: id as number,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
    console.log('message that just got created : ');
    console.log(createdChatMessage);



    return createdChatMessage;
  }
  async findAll(name: string) {
    console.log('name: ');
    console.log(name);

    const messages = await this.prisma.chatMessage.findMany({

      where: {
        chat: {
          name: name,
        },
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
    return messages;
  }
  async findRoom(name: string) {
   
    const chat = await this.prisma.chat.findFirst({
      where: {
        name: name,
      },
    });

    return chat;
  }

  async getUsers(id: number) {
    const users = await this.prisma.player.findMany();
    return users;
  }

  async getRooms(id : number) {



    const rooms = await this.prisma.chat.findMany({
      where: {
        users: {
          some: {
            userId: id,
          },
        },
      },
    });
    return rooms;
  }
}
