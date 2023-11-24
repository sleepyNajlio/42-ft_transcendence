import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { join } from 'path';
import { AppModule } from './app.module';
import session from 'express-session';
import passport from 'passport';
// import { HttpExceptionFilter } from './http-exception.filter';
// import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();

  // app.useWebSocketAdapter(new IoAdapter(app));
  // app.useGlobalFilters(new HttpExceptionFilter());

  app.use(
    session({ resave: false, saveUninitialized: false, secret: '!Seoul' }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
