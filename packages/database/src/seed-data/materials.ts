import { MaterialType, Prisma } from '@prisma/client';

export const materials: Prisma.MaterialCreateInput[] = [
  // Banery winylowe
  {
    name: 'Baner winylowy 440g',
    type: MaterialType.BANNER_VINYL,
    width: 1370, // mm
    pricePerM2: 45.00,
    stockMeters: 150.0,
    minStock: 20.0,
  },
  {
    name: 'Baner winylowy 510g',
    type: MaterialType.BANNER_VINYL,
    width: 1370,
    pricePerM2: 52.00,
    stockMeters: 120.0,
    minStock: 20.0,
  },
  {
    name: 'Baner winylowy 610g',
    type: MaterialType.BANNER_VINYL,
    width: 1370,
    pricePerM2: 58.00,
    stockMeters: 100.0,
    minStock: 15.0,
  },

  // Papiery plakatowe
  {
    name: 'Papier Citylight 135g',
    type: MaterialType.POSTER_PAPER,
    width: 1370,
    pricePerM2: 25.00,
    stockMeters: 200.0,
    minStock: 30.0,
  },
  {
    name: 'Papier Citylight 200g',
    type: MaterialType.POSTER_PAPER,
    width: 1370,
    pricePerM2: 32.00,
    stockMeters: 180.0,
    minStock: 25.0,
  },
  {
    name: 'Papier Blueback',
    type: MaterialType.POSTER_PAPER,
    width: 1370,
    pricePerM2: 28.00,
    stockMeters: 160.0,
    minStock: 25.0,
  },

  // Folie samoprzylepne
  {
    name: 'Folia samoprzylepna Premium',
    type: MaterialType.SELF_ADHESIVE,
    width: 1370,
    pricePerM2: 65.00,
    stockMeters: 80.0,
    minStock: 15.0,
  },
  {
    name: 'Folia samoprzylepna Standard',
    type: MaterialType.SELF_ADHESIVE,
    width: 1370,
    pricePerM2: 55.00,
    stockMeters: 100.0,
    minStock: 20.0,
  },
  {
    name: 'Folia samoprzylepna Transparentna',
    type: MaterialType.SELF_ADHESIVE,
    width: 1370,
    pricePerM2: 70.00,
    stockMeters: 60.0,
    minStock: 10.0,
  },

  // Folie backlit
  {
    name: 'Folia backlit Premium',
    type: MaterialType.BACKLIT_FILM,
    width: 1370,
    pricePerM2: 85.00,
    stockMeters: 50.0,
    minStock: 10.0,
  },
  {
    name: 'Folia backlit Standard',
    type: MaterialType.BACKLIT_FILM,
    width: 1370,
    pricePerM2: 75.00,
    stockMeters: 70.0,
    minStock: 15.0,
  },

  // Banery siatkowe
  {
    name: 'Baner siatkowy 320g',
    type: MaterialType.MESH_BANNER,
    width: 1370,
    pricePerM2: 48.00,
    stockMeters: 90.0,
    minStock: 15.0,
  },
  {
    name: 'Baner siatkowy 420g',
    type: MaterialType.MESH_BANNER,
    width: 1370,
    pricePerM2: 55.00,
    stockMeters: 80.0,
    minStock: 15.0,
  },

  // Płótno
  {
    name: 'Płótno Canvas Premium',
    type: MaterialType.CANVAS,
    width: 1370,
    pricePerM2: 95.00,
    stockMeters: 40.0,
    minStock: 8.0,
  },
  {
    name: 'Płótno Canvas Standard',
    type: MaterialType.CANVAS,
    width: 1370,
    pricePerM2: 85.00,
    stockMeters: 60.0,
    minStock: 10.0,
  },

  // Papier fotograficzny
  {
    name: 'Papier fotograficzny Premium',
    type: MaterialType.PHOTO_PAPER,
    width: 1370,
    pricePerM2: 120.00,
    stockMeters: 30.0,
    minStock: 5.0,
  },
  {
    name: 'Papier fotograficzny Standard',
    type: MaterialType.PHOTO_PAPER,
    width: 1370,
    pricePerM2: 100.00,
    stockMeters: 50.0,
    minStock: 8.0,
  },
];

