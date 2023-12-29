import {
  Controller,
  Get,
  Redirect,
  Render,
  Req,
  UseGuards,
  Session,
  Res,
  SetMetadata,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';
import { PrismaClient } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly httpService: HttpService) {}

  @Get()
  @SetMetadata('isPublic', true)
  hello() {
    return 'Get to Work!';
  }
}
