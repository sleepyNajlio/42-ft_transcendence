import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Import PrismaModule here
  providers: [MessagesService],
})
export class MessagesModule {}
