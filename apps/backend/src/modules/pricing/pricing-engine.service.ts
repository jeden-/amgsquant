import { Injectable } from '@nestjs/common';

export interface PriceCalculationRequest {
  productType: string;
  width: number;
  height: number;
  materialType: string;
  quantity: number;
  finishingOptions?: {
    laminate?: string;
    mounting?: string;
    cutting?: string;
  };
  rushType: string;
  accountType: string;
}

export interface PriceCalculationResponse {
  unitPrice: number;
  totalPrice: number;
  materialCost: number;
  finishingCost: number;
  rushCost: number;
  discount: number;
  vat: number;
  grossPrice: number;
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

@Injectable()
export class PricingEngineService {
  private readonly priceTables = {
    // Tabele cenowe z dokumentu PDF
    PAPER_135G: {
      POSTER: {
        '0-10': 2.10,
        '11-50': 1.80,
        '51-100': 1.60,
        '101-500': 1.40,
        '501+': 1.20,
      },
      BANNER: {
        '0-10': 2.50,
        '11-50': 2.20,
        '51-100': 2.00,
        '101-500': 1.80,
        '501+': 1.60,
      },
    },
    PAPER_170G: {
      POSTER: {
        '0-10': 2.30,
        '11-50': 2.00,
        '51-100': 1.80,
        '101-500': 1.60,
        '501+': 1.40,
      },
      BANNER: {
        '0-10': 2.70,
        '11-50': 2.40,
        '51-100': 2.20,
        '101-500': 2.00,
        '501+': 1.80,
      },
    },
    PAPER_250G: {
      POSTER: {
        '0-10': 2.80,
        '11-50': 2.50,
        '51-100': 2.30,
        '101-500': 2.10,
        '501+': 1.90,
      },
      BANNER: {
        '0-10': 3.20,
        '11-50': 2.90,
        '51-100': 2.70,
        '101-500': 2.50,
        '501+': 2.30,
      },
    },
    PAPER_300G: {
      POSTER: {
        '0-10': 3.20,
        '11-50': 2.90,
        '51-100': 2.70,
        '101-500': 2.50,
        '501+': 2.30,
      },
      BANNER: {
        '0-10': 3.60,
        '11-50': 3.30,
        '51-100': 3.10,
        '101-500': 2.90,
        '501+': 2.70,
      },
    },
  };

  private readonly finishingCosts = {
    MATTE: 0.50,
    GLOSS: 0.60,
    SOFT_TOUCH: 0.80,
    MOUNTING: 2.00,
    CUTTING: 0.30,
  };

  private readonly rushMultipliers = {
    STANDARD: 1.0,
    EXPRESS: 1.5,
    URGENT: 2.0,
  };

  private readonly accountDiscounts = {
    B2C: 0,
    B2B: 0.1,
    WHOLESALE: 0.2,
  };

  calculatePrice(request: PriceCalculationRequest): PriceCalculationResponse {
    const { productType, width, height, materialType, quantity, finishingOptions, rushType, accountType } = request;

    // Oblicz powierzchnię w m²
    const area = (width * height) / 1000000; // mm² to m²

    // Pobierz cenę bazową z tabeli
    const basePrice = this.getBasePrice(materialType, productType, quantity);

    // Oblicz koszt materiału
    const materialCost = basePrice * area;

    // Oblicz koszt wykończenia
    let finishingCost = 0;
    if (finishingOptions) {
      if (finishingOptions.laminate) {
        finishingCost += this.finishingCosts[finishingOptions.laminate] * area;
      }
      if (finishingOptions.mounting) {
        finishingCost += this.finishingCosts.MOUNTING * area;
      }
      if (finishingOptions.cutting) {
        finishingCost += this.finishingCosts.CUTTING * area;
      }
    }

    // Oblicz koszt rush
    const rushMultiplier = this.rushMultipliers[rushType] || 1.0;
    const rushCost = (materialCost + finishingCost) * (rushMultiplier - 1);

    // Oblicz subtotal
    const subtotal = materialCost + finishingCost + rushCost;

    // Oblicz rabat
    const discountRate = this.accountDiscounts[accountType] || 0;
    const discount = subtotal * discountRate;

    // Oblicz cenę po rabacie
    const priceAfterDiscount = subtotal - discount;

    // Oblicz VAT (23%)
    const vat = priceAfterDiscount * 0.23;

    // Oblicz cenę brutto
    const grossPrice = priceAfterDiscount + vat;

    // Oblicz cenę jednostkową
    const unitPrice = grossPrice / quantity;

    return {
      unitPrice: Math.round(unitPrice * 100) / 100,
      totalPrice: Math.round(grossPrice * 100) / 100,
      materialCost: Math.round(materialCost * 100) / 100,
      finishingCost: Math.round(finishingCost * 100) / 100,
      rushCost: Math.round(rushCost * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      vat: Math.round(vat * 100) / 100,
      grossPrice: Math.round(grossPrice * 100) / 100,
      breakdown: {
        material: Math.round(materialCost * 100) / 100,
        finishing: Math.round(finishingCost * 100) / 100,
        rush: Math.round(rushCost * 100) / 100,
        discount: Math.round(discount * 100) / 100,
        subtotal: Math.round(priceAfterDiscount * 100) / 100,
        vat: Math.round(vat * 100) / 100,
        total: Math.round(grossPrice * 100) / 100,
      },
    };
  }

  private getBasePrice(materialType: string, productType: string, quantity: number): number {
    const materialTable = this.priceTables[materialType];
    if (!materialTable) {
      throw new Error(`Unknown material type: ${materialType}`);
    }

    const productTable = materialTable[productType];
    if (!productTable) {
      throw new Error(`Unknown product type: ${productType}`);
    }

    // Określ przedział ilościowy
    let priceKey = '501+';
    if (quantity <= 10) priceKey = '0-10';
    else if (quantity <= 50) priceKey = '11-50';
    else if (quantity <= 100) priceKey = '51-100';
    else if (quantity <= 500) priceKey = '101-500';

    return productTable[priceKey];
  }

  getAvailableMaterials(): string[] {
    return Object.keys(this.priceTables);
  }

  getAvailableProductTypes(): string[] {
    const firstMaterial = Object.keys(this.priceTables)[0];
    return Object.keys(this.priceTables[firstMaterial]);
  }

  getRushOptions(): Array<{ type: string; multiplier: number; description: string }> {
    return [
      { type: 'STANDARD', multiplier: 1.0, description: 'Standardowa dostawa (3-5 dni)' },
      { type: 'EXPRESS', multiplier: 1.5, description: 'Ekspresowa dostawa (1-2 dni)' },
      { type: 'URGENT', multiplier: 2.0, description: 'Pilna dostawa (24h)' },
    ];
  }
}
