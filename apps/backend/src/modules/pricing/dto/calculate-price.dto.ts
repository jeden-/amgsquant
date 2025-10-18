import { IsString, IsNumber, IsOptional, IsObject, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalculatePriceDto {
  @ApiProperty({ enum: ['POSTER', 'BANNER', 'STICKER', 'FLAG'] })
  @IsEnum(['POSTER', 'BANNER', 'STICKER', 'FLAG'])
  productType: string;

  @ApiProperty({ description: 'Width in mm' })
  @IsNumber()
  width: number;

  @ApiProperty({ description: 'Height in mm' })
  @IsNumber()
  height: number;

  @ApiProperty({ enum: ['PAPER_135G', 'PAPER_170G', 'PAPER_250G', 'PAPER_300G'] })
  @IsEnum(['PAPER_135G', 'PAPER_170G', 'PAPER_250G', 'PAPER_300G'])
  materialType: string;

  @ApiProperty({ minimum: 1 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  finishingOptions?: {
    laminate?: string;
    mounting?: string;
    cutting?: string;
  };

  @ApiProperty({ enum: ['STANDARD', 'EXPRESS', 'URGENT'] })
  @IsEnum(['STANDARD', 'EXPRESS', 'URGENT'])
  rushType: string;

  @ApiProperty({ enum: ['B2C', 'B2B', 'WHOLESALE'] })
  @IsEnum(['B2C', 'B2B', 'WHOLESALE'])
  accountType: string;
}

export class PriceResponseDto {
  @ApiProperty()
  unitPrice: number;

  @ApiProperty()
  totalPrice: number;

  @ApiProperty()
  materialCost: number;

  @ApiProperty()
  finishingCost: number;

  @ApiProperty()
  rushCost: number;

  @ApiProperty()
  discount: number;

  @ApiProperty()
  vat: number;

  @ApiProperty()
  grossPrice: number;

  @ApiProperty()
  breakdown: {
    material: number;
    finishing: number;
    rush: number;
    discount: number;
    subtotal: number;
    vat: number;
    total: number;
  };
}
