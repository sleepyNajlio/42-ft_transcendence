import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { LoginModule } from './login/login.module';

@Module({
  imports: [ConfigModule.forRoot(), LoginModule, HttpModule],
  controllers: [AppController],
})
export class AppModule {}
