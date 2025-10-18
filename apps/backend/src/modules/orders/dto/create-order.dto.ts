import { IsString, IsNumber, IsArray, IsOptional, IsEnum, ValidateNested, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty()
  @IsString()
  productType: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  width: number;

  @ApiProperty()
  @IsNumber()
  height: number;

  @ApiProperty()
  @IsString()
  materialType: string;

  @ApiProperty({ required: false })
  @IsOptional()
  finishingOptions?: {
    laminate?: string;
    mounting?: string;
    cutting?: string;
  };

  @ApiProperty()
  @IsNumber()
  unitPrice: number;

  @ApiProperty()
  @IsNumber()
  totalPrice: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty()
  @IsUUID()
  shippingAddressId: string;

  @ApiProperty()
  @IsUUID()
  billingAddressId: string;

  @ApiProperty({ enum: ['INPOST_PACZKOMAT', 'INPOST_KURIER', 'DPD', 'POCZTA_POLSKA'] })
  @IsEnum(['INPOST_PACZKOMAT', 'INPOST_KURIER', 'DPD', 'POCZTA_POLSKA'])
  shippingMethod: string;

  @ApiProperty({ enum: ['CARD', 'TRANSFER', 'CASH', 'PAYPAL'] })
  @IsEnum(['CARD', 'TRANSFER', 'CASH', 'PAYPAL'])
  paymentMethod: string;

  @ApiProperty({ enum: ['STANDARD', 'EXPRESS', 'URGENT'] })
  @IsEnum(['STANDARD', 'EXPRESS', 'URGENT'])
  rushType: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateOrderDto {
  @ApiProperty({ enum: ['PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'READY', 'SHIPPED', 'DELIVERED', 'CANCELLED'] })
  @IsEnum(['PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'READY', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
  status: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
