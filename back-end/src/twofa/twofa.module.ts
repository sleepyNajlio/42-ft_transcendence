import { Module } from '@nestjs/common';
import { TwofaService } from './twofa.service';
import { TwofaController } from './twofa.controller';
import { ProfileModule } from 'src/profile/profile.module';

@Module({
  imports: [ProfileModule],
  controllers: [TwofaController],
  providers: [TwofaService],
})
export class TwofaModule {}
