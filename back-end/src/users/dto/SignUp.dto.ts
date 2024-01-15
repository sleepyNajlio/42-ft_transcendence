import { IsString, IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';
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

export class MailDTO {
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class TwoFaDTO extends PartialType(SignUpDTO) {
  //user id
  @IsNumber()
  @IsNotEmpty()
  id_player: number;

  @IsString()
  @IsNotEmpty()
  TwoFaSecret: string;
}
