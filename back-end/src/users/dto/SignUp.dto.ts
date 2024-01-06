import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class SignUpDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  avatar: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}

export class FinishSignUpDTO extends SignUpDTO {
  @IsBoolean()
  @IsNotEmpty()
  isAuthenticated: boolean;
}
