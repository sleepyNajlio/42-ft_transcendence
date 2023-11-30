import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { RequestMethod, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: [RequestMethod.ALL.toString()],
  });
  app.use(cookieParser());
  app.use(passport.initialize());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();