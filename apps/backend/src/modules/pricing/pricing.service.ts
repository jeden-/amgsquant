import { Injectable } from '@nestjs/common';
import { PricingEngineService, PriceCalculationRequest, PriceCalculationResponse } from './pricing-engine.service';
import { CalculatePriceDto } from './dto/calculate-price.dto';

@Injectable()
export class PricingService {
  constructor(private pricingEngine: PricingEngineService) {}

  async calculatePrice(dto: CalculatePriceDto): Promise<PriceCalculationResponse> {
    const request: PriceCalculationRequest = {
      productType: dto.productType,
      width: dto.width,
      height: dto.height,
      materialType: dto.materialType,
      quantity: dto.quantity,
      finishingOptions: dto.finishingOptions,
      rushType: dto.rushType,
      accountType: dto.accountType,
    };

    return this.pricingEngine.calculatePrice(request);
  }

  async getMaterials(): Promise<string[]> {
    return this.pricingEngine.getAvailableMaterials();
  }

  async getProductTypes(): Promise<string[]> {
    return this.pricingEngine.getAvailableProductTypes();
  }

  async getRushOptions(): Promise<Array<{ type: string; multiplier: number; description: string }>> {
    return this.pricingEngine.getRushOptions();
  }
}
