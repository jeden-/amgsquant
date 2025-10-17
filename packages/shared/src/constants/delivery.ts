export enum RushType {
  STANDARD = 'STANDARD',
  EXPRESS_48H = 'EXPRESS_48H',
  EXPRESS_24H = 'EXPRESS_24H',
  SAME_DAY = 'SAME_DAY',
}

export interface RushTypeOption {
  type: RushType;
  label: string;
  hours: number;
  multiplier: number;
  description: string;
}

export const RUSH_OPTIONS: Record<RushType, RushTypeOption> = {
  [RushType.STANDARD]: {
    type: RushType.STANDARD,
    label: 'Standard 72h',
    hours: 72,
    multiplier: 1.0,
    description: 'Standardowa realizacja - 3 dni robocze',
  },
  [RushType.EXPRESS_48H]: {
    type: RushType.EXPRESS_48H,
    label: 'Express 48h',
    hours: 48,
    multiplier: 1.3,
    description: 'Szybka realizacja - 2 dni robocze (+30%)',
  },
  [RushType.EXPRESS_24H]: {
    type: RushType.EXPRESS_24H,
    label: 'Super Express 24h',
    hours: 24,
    multiplier: 1.5,
    description: 'Bardzo szybka realizacja - 1 dzień roboczy (+50%)',
  },
  [RushType.SAME_DAY]: {
    type: RushType.SAME_DAY,
    label: 'Tego samego dnia',
    hours: 8,
    multiplier: 2.0,
    description: 'Ekspresowa realizacja - tego samego dnia (+100%)',
  },
};

export const SHIPPING_COSTS = {
  INPOST_PACZKOMAT: 14.99,
  INPOST_COURIER: 19.99,
  DPD: 24.99,
  DHL: 29.99,
  PICKUP: 0,
} as const;
