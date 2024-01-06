import { IsNumber, IsNotEmpty } from 'class-validator';

export class TokenDTO {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}







