import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { join } from 'path';
import { AppModule } from './app.module';
import session from 'express-session';
import passport from 'passport';
// import { HttpExceptionFilter } from './http-exception.filter';
// import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable Cross-Origin Resource Sharing
  await app.listen(3000);
}
bootstrap();
