import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class RegisterDto {
    @IsEmail()
    @ApiProperty()
    email: string;;

    @IsString()
    @ApiProperty()
    username: string

    @IsString()
    @ApiProperty()
    password: string;

    @IsString()
    @ApiProperty()
    name: string;

    @IsString()
    @ApiProperty()
    phone: string;

    @IsString()
    @ApiProperty({ enum: ['PLAYER', 'MANAGER', 'COACH'] })
    role: string
}

export class LoginPayload {
    @IsString()
    @ApiProperty()
    username: string;

    @IsString()
    @ApiProperty()
    password: string;
}

export class ChangePasswordDto {
    @IsString()
    @ApiProperty()
    oldPassword: string;

    @IsString()
    @ApiProperty()
    newPassword: string;
}

export class VerifyOtpDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456' })
    @IsString()
    otp: string;
}