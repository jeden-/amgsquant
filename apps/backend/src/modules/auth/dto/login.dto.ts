import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@amgsquant.pl' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Test1234!' })
  @IsString()
  @MinLength(8)
  password: string;
}
