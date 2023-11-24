import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { GameGateway } from 'src/game/game.gateway';
import { MessagesGateway } from 'src/Chat/messages.gateway';
import { MessagesService } from 'src/Chat/messages.service';

@Module({
  providers: [
    SocketGateway,
    SocketService,
    GameGateway,
    MessagesGateway,
    MessagesService,
  ],
})
export class SocketModule {}
