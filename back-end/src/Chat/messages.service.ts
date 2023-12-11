import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

type ChatMessageUncheckedCreateInput = Prisma.ChatMessageUncheckedCreateInput;
type ChatWhereInput = Prisma.ChatWhereInput;


@Injectable()
export class MessagesService {
  public clients = {};

  constructor(private prisma: PrismaService) {}

  async identify(id: number, name: string, clientId: string) {
    console.log('id: ' + id + ' user: ' + name + ' just joined the chat');

    const existingChat = await this.prisma.chat.findFirst({
      where: {
        users: {
          some: {
            userId: id,
          },
        },
        name :
        {
          equals: name,
        }
      } as ChatWhereInput,
    });

    if (existingChat) {
      console.log('User with ID ' + id + ' has already created a chat.');
      return;
    }


    const chat = await this.prisma.chat.create({
      data: {
        name: name,
      },
    });

    const chatusers = await this.prisma.chatUser.create({
      data: {
        chatId: chat.id_chat,
        userId: id,
      },
    });

    console.log(chat);
    console.log('-------------------');
    console.log(chatusers);
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
}
