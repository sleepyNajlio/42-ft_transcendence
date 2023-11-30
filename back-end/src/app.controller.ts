import {
  Controller,
  Get,
  Redirect,
  Render,
  Req,
  UseGuards,
  Session,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map } from 'rxjs';

@Controller()
export class AppController {
  constructor(private readonly httpService: HttpService) {}

}
