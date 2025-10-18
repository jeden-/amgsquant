import { Module } from '@nestjs/common';
import { PricingController } from './pricing.controller';
import { PricingService } from './pricing.service';
import { PricingEngineService } from './pricing-engine.service';

@Module({
  controllers: [PricingController],
  providers: [PricingService, PricingEngineService],
  exports: [PricingService, PricingEngineService],
})
export class PricingModule {}
