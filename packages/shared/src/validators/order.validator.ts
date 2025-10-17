import { z } from 'zod';
import { MaterialType } from '../constants/materials';
import { RushType } from '../constants/delivery';

export enum ShippingMethod {
  INPOST_PACZKOMAT = 'INPOST_PACZKOMAT',
  INPOST_COURIER = 'INPOST_COURIER',
  DPD = 'DPD',
  DHL = 'DHL',
  PICKUP = 'PICKUP',
}

export const finishingOptionsSchema = z.object({
  laminate: z.enum(['MATTE', 'GLOSS', 'BOTH_SIDES']).optional(),
  cutting: z.enum(['RECTANGLE', 'OPOS']).optional(),
  eyelets: z.number().int().min(0).max(100).optional(),
  tunnel: z.boolean().optional(),
  mounting: z.enum(['PCV3MM', 'PCV5MM', 'FOAM5MM', 'HIPS3MM', 'DIBOND']).optional(),
  rollupCassette: z.enum(['STANDARD_85', 'PREMIUM_85', 'STANDARD_100', 'PREMIUM_100', 'STANDARD_120', 'PREMIUM_120']).optional(),
});

export const productConfigurationSchema = z.object({
  productType: z.string(),
  width: z.number().min(100).max(5000), // mm
  height: z.number().min(100).max(5000), // mm
  material: z.nativeEnum(MaterialType),
  quantity: z.number().int().min(1).max(1000),
  finishing: finishingOptionsSchema,
});

export const orderItemRequestSchema = productConfigurationSchema.extend({
  fileId: z.string().uuid().optional(),
});

export const createOrderRequestSchema = z.object({
  items: z.array(orderItemRequestSchema).min(1).max(50),
  shippingAddressId: z.string().uuid(),
  billingAddressId: z.string().uuid(),
  shippingMethod: z.nativeEnum(ShippingMethod),
  paymentMethod: z.string(),
  notes: z.string().max(1000).optional(),
});

export const priceCalculationRequestSchema = productConfigurationSchema.extend({
  rushType: z.nativeEnum(RushType),
  accountType: z.enum(['B2C', 'B2B', 'AGENCY']),
  customerDiscount: z.number().min(0).max(100).optional(),
});

// Helper types
export type FinishingOptionsInput = z.infer<typeof finishingOptionsSchema>;
export type ProductConfigurationInput = z.infer<typeof productConfigurationSchema>;
export type OrderItemRequestInput = z.infer<typeof orderItemRequestSchema>;
export type CreateOrderRequestInput = z.infer<typeof createOrderRequestSchema>;
export type PriceCalculationRequestInput = z.infer<typeof priceCalculationRequestSchema>;
