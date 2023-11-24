import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { LoginModule } from './login/login.module';
import { MessagesModule } from './Chat/messages.module';
// import { GameGateway } from './game/game.gateway';
import { SocketModule } from './socket/socket.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoginModule,
    HttpModule,
    MessagesModule,
    SocketModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [SocketModule],
})
export class AppModule {}
