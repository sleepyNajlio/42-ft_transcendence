import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { MessagesModule } from './Chat/messages.module';
// import { GameGateway } from './game/game.gateway';
import { SocketModule } from './socket/socket.module';
import { GameModule } from './game/game.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfileModule } from './profile/profile.module';

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
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}



