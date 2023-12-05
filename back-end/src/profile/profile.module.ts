import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'dontTellAnyone',
      // secret: new ConfigService().get('JWT_SECRET'),
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
