import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class MailDTO {
  @IsString()
  @IsNotEmpty()
  email: string;
}
