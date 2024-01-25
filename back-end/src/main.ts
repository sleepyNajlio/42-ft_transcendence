import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const config = new ConfigService();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: config.get('FRONTEND_URL'),
    credentials: true,
    methods: [RequestMethod.ALL.toString()],
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  });
  app.use(cookieParser());
  app.use(passport.initialize());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001, '0.0.0.0');
}

bootstrap();
