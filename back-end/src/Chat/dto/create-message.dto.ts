import { IsNotEmpty, IsString , IsOptional, IsBoolean, IsNumber} from 'class-validator';
import {ChatType} from '@prisma/client';



export class CreateMessageDto {

    @IsString()
    @IsNotEmpty()
    text: string;
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsNumber()
    id: number;
    @IsOptional()
    @IsString()
    username: string;
}

export class createRoomDto {

    @IsNumber()
    id1: number;
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsString()
    @IsNotEmpty()
    roomType: ChatType;
    @IsOptional()
    @IsString()
    roomPassword: string;
}

export class updatedRoomDto {
    
    @IsNumber()
    id: number;
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsString()
    @IsNotEmpty()
    type: string;
    @IsOptional()
    @IsString()
    newPass: string;
    @IsOptional()
    @IsBoolean()
    modifypass: boolean;
    @IsOptional()
    @IsBoolean()
    setPass: boolean;
    @IsOptional()
    @IsBoolean()
    removepass: boolean;
}

export class selectedPswdDto {
    @IsString()
    @IsNotEmpty()
    selectedPswd: string;
}
