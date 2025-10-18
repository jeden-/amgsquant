export interface Format {
  name: string;
  width: number; // mm
  height: number; // mm
  area: number; // m²
}

export const STANDARD_FORMATS: Record<string, Format> = {
  A4: {
    name: 'A4',
    width: 210,
    height: 297,
    area: 0.0625,
  },
  A3: {
    name: 'A3',
    width: 297,
    height: 420,
    area: 0.125,
  },
  A2: {
    name: 'A2',
    width: 420,
    height: 594,
    area: 0.25,
  },
  A1: {
    name: 'A1',
    width: 594,
    height: 841,
    area: 0.5,
  },
  A0: {
    name: 'A0',
    width: 841,
    height: 1189,
    area: 1.0,
  },
  B1: {
    name: 'B1',
    width: 707,
    height: 1000,
    area: 0.707,
  },
  B2: {
    name: 'B2',
    width: 500,
    height: 707,
    area: 0.353,
  },
};

export const BANNER_FORMATS: Record<string, Format> = {
  '50x70': {
    name: '50×70 cm',
    width: 500,
    height: 700,
    area: 0.35,
  },
  '70x100': {
    name: '70×100 cm',
    width: 700,
    height: 1000,
    area: 0.7,
  },
  '100x140': {
    name: '100×140 cm',
    width: 1000,
    height: 1400,
    area: 1.4,
  },
  '120x180': {
    name: '120×180 cm',
    width: 1200,
    height: 1800,
    area: 2.16,
  },
};

