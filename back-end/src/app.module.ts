import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { LoginModule } from './login/login.module';
import { MessagesModule } from './Chat/messages.module';

@Module({
  imports: [ConfigModule.forRoot(), LoginModule, HttpModule, MessagesModule],
  controllers: [AppController],
})
export class AppModule {}
