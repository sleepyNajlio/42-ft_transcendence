import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  messages: Message[] = [{ name: 'Fahid', text: 'Wach Wach!' }];
  create(createMessageDto: CreateMessageDto) {
    const message = { ...createMessageDto };
    this.messages.push(message); // TODO : improve this method
    return message;
  }

  findAll() {
    return this.messages; // TODO : add a query to select all from the messages table
  }
}
