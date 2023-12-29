import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { MessagesModule } from './Chat/messages.module';
import { SocketModule } from './socket/socket.module';
import { GameModule } from './game/game.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { TwofaModule } from './twofa/twofa.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PassportModule,
    HttpModule,
    MessagesModule,
    SocketModule,
    GameModule,
    ProfileModule,
    TwofaModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
