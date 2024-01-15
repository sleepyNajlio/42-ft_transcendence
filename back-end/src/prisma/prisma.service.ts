import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Extensions } from '@prisma/client/runtime/library';
import { PrismaModule } from './prisma.module';

@Injectable()
export class PrismaService extends PrismaClient {
  async onModuleInit() {
    await this.$connect();
  }
}
