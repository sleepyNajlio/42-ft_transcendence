import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

type ChatMessageUncheckedCreateInput = Prisma.ChatMessageUncheckedCreateInput;

@Injectable()
export class MessagesService {
  public clients = {};

  constructor(private prisma: PrismaService) {}

  async identify(id: number, name : string , clientId: string) {
    console.log('id: ' + id + ' user: ' + name + ' just joined the chat');
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
    
    console.log('in service :');
    console.log(id);
    const message = {
      name: this.clients[clientId],
      text: createMessageDto.text,
    };
    console.log('message name that create the message: ');
    console.log(message.name);

    const chat = await this.prisma.chat.findFirst({
      where: {
        name: message.name,
      },
    });

    const chatMessage: ChatMessageUncheckedCreateInput = {
      message: message.text,
      chatId: chat.id_chat as number,
      userId: id
    };

    const createdChatMessage = await this.prisma.chatMessage.create({
      data:  {
        message: message.text,
        chatId: chat.id_chat as number,
        userId: id
      }
    });

    console.log('message that just got created : ');
    console.log(createdChatMessage);

    return message;
  }
  async findAll() {
    console.log('in find all : ');
    console.log(await this.prisma.chatMessage.findMany());
    return await this.prisma.chatMessage.findMany(); // TODO : add a query to select all from the messages table
  }
}
