import { IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AddressType } from '@prisma/client';

export class CreateAddressDto {
  @ApiProperty({ enum: AddressType, default: AddressType.SHIPPING })
  @IsEnum(AddressType)
  type: AddressType;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty()
  @IsString()
  street: string;

  @ApiProperty()
  @IsString()
  streetNumber: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  apartment?: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  postalCode: string;

  @ApiProperty({ default: 'PL' })
  @IsString()
  country: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  isDefault: boolean;
}
