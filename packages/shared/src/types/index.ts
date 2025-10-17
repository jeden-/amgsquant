// Re-export types from constants
export type {
  RushTypeOption,
} from '../constants/delivery';

export type {
  MaterialInfo,
} from '../constants/materials';

export type {
  Format,
} from '../constants/formats';

// Additional shared types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
