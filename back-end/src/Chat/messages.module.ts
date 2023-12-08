import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MessagesGateway } from './messages.gateway';

@Module({
  imports: [PrismaModule], // Import PrismaModule here
  providers: [MessagesGateway, MessagesService],
})
export class MessagesModule {}
