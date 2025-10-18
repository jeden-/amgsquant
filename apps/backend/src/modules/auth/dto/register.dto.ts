import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Jan' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Kowalski' })
  @IsString()
  lastName: string;

  @ApiProperty({ required: false, example: '+48123456789' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, enum: UserType })
  @IsOptional()
  @IsEnum(UserType)
  accountType?: UserType;

  @ApiProperty({ required: false, example: 'Firma Sp. z o.o.' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ required: false, example: '1234567890' })
  @IsOptional()
  @IsString()
  nip?: string;
}
