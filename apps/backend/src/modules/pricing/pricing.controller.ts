import { Controller, Post, Get, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PricingService } from './pricing.service';
import { CalculatePriceDto, PriceResponseDto } from './dto/calculate-price.dto';

@ApiTags('pricing')
@Controller('pricing')
export class PricingController {
  constructor(private pricingService: PricingService) {}

  @Post('calculate')
  @ApiOperation({ summary: 'Calculate price for print job' })
  @ApiResponse({ status: 200, type: PriceResponseDto })
  async calculatePrice(@Body() dto: CalculatePriceDto) {
    return await this.pricingService.calculatePrice(dto);
  }

  @Get('materials')
  @ApiOperation({ summary: 'Get available materials' })
  @ApiResponse({ status: 200, type: [String] })
  async getMaterials() {
    return await this.pricingService.getMaterials();
  }

  @Get('product-types')
  @ApiOperation({ summary: 'Get available product types' })
  @ApiResponse({ status: 200, type: [String] })
  async getProductTypes() {
    return await this.pricingService.getProductTypes();
  }

  @Get('rush-options')
  @ApiOperation({ summary: 'Get available rush options' })
  @ApiResponse({ status: 200 })
  async getRushOptions() {
    return await this.pricingService.getRushOptions();
  }
}
