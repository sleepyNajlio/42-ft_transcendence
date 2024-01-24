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
  @IsNumber()
  @IsNotEmpty()
  id_player: number;

  @IsString()
  @IsNotEmpty()
  twoFASecret: string;

  @IsBoolean()
  TwoFaStatus: boolean;
}

export class UserDTO extends PartialType(TwoFaDTO) 
{
  twoFASecret?: string;
}

export class Update2faDTO {
  @IsNotEmpty()
  twoFaCode: string;
}

export class UpdateUsernameDTO {
  @IsString()
  @IsNotEmpty()
  username: string;
}
