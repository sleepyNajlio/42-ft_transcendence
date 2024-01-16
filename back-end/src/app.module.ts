import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MessagesModule } from './Chat/messages.module';
import { SocketModule } from './socket/socket.module';
import { GameModule } from './game/game.module';
import { ProfileModule } from './profile/profileModule';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    ProfileModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    MessagesModule,
    SocketModule,
    GameModule,
    MulterModule.register({
      dest: './avatars',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'avatars'),
      serveRoot: '/avatars',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
