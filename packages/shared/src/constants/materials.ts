export enum MaterialType {
  BANNER_VINYL = 'BANNER_VINYL',
  POSTER_PAPER = 'POSTER_PAPER',
  SELF_ADHESIVE = 'SELF_ADHESIVE',
  BACKLIT_FILM = 'BACKLIT_FILM',
  MESH_BANNER = 'MESH_BANNER',
  CANVAS = 'CANVAS',
  PHOTO_PAPER = 'PHOTO_PAPER',
}

export interface MaterialInfo {
  type: MaterialType;
  name: string;
  description: string;
  width: number; // mm
  thickness?: number; // μm
  pricePerM2: number; // PLN
  suitableFor: string[];
  finishing: string[];
}

export const MATERIAL_INFO: Record<MaterialType, MaterialInfo> = {
  [MaterialType.BANNER_VINYL]: {
    type: MaterialType.BANNER_VINYL,
    name: 'Baner winylowy',
    description: 'Materiał winylowy do druku zewnętrznego',
    width: 1370,
    thickness: 440,
    pricePerM2: 45.00,
    suitableFor: ['banery', 'plakaty zewnętrzne'],
    finishing: ['oczka', 'taśmy', 'cięcie'],
  },
  [MaterialType.POSTER_PAPER]: {
    type: MaterialType.POSTER_PAPER,
    name: 'Papier Citylight',
    description: 'Papier do druku wewnętrznego',
    width: 1370,
    thickness: 135,
    pricePerM2: 25.00,
    suitableFor: ['plakaty', 'afisze'],
    finishing: ['laminat', 'cięcie'],
  },
  [MaterialType.SELF_ADHESIVE]: {
    type: MaterialType.SELF_ADHESIVE,
    name: 'Folia samoprzylepna',
    description: 'Folia do naklejek i oznaczeń',
    width: 1370,
    thickness: 100,
    pricePerM2: 65.00,
    suitableFor: ['naklejki', 'oznaczenia'],
    finishing: ['cięcie', 'konturowanie'],
  },
  [MaterialType.BACKLIT_FILM]: {
    type: MaterialType.BACKLIT_FILM,
    name: 'Folia backlit',
    description: 'Folia do oświetlanych konstrukcji',
    width: 1370,
    thickness: 200,
    pricePerM2: 85.00,
    suitableFor: ['backlit', 'lightbox'],
    finishing: ['cięcie'],
  },
  [MaterialType.MESH_BANNER]: {
    type: MaterialType.MESH_BANNER,
    name: 'Baner siatkowy',
    description: 'Baner przepuszczający powietrze',
    width: 1370,
    thickness: 320,
    pricePerM2: 48.00,
    suitableFor: ['rusztowania', 'ogrodzenia'],
    finishing: ['oczka', 'taśmy'],
  },
  [MaterialType.CANVAS]: {
    type: MaterialType.CANVAS,
    name: 'Płótno Canvas',
    description: 'Płótno do druku artystycznego',
    width: 1370,
    thickness: 300,
    pricePerM2: 95.00,
    suitableFor: ['obrazy', 'reprodukcje'],
    finishing: ['naciągnięcie na blejtram'],
  },
  [MaterialType.PHOTO_PAPER]: {
    type: MaterialType.PHOTO_PAPER,
    name: 'Papier fotograficzny',
    description: 'Papier do druku fotograficznego',
    width: 1370,
    thickness: 250,
    pricePerM2: 120.00,
    suitableFor: ['fotografie', 'reprodukcje'],
    finishing: ['laminat', 'cięcie'],
  },
};
