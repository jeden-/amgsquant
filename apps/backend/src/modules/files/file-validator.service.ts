import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  dimensions?: { width: number; height: number };
}

@Injectable()
export class FileValidatorService {
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/tiff',
    'image/bmp',
    'application/pdf',
    'application/postscript',
    'image/svg+xml',
  ];

  private readonly maxFileSize = 100 * 1024 * 1024; // 100MB

  async validateFile(file: Express.Multer.File): Promise<ValidationResult> {
    const errors: string[] = [];

    // Check file size
    if (file.size > this.maxFileSize) {
      errors.push(`File size exceeds maximum allowed size of ${this.maxFileSize / (1024 * 1024)}MB`);
    }

    // Check MIME type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      errors.push(`File type ${file.mimetype} is not supported`);
    }

    // Get dimensions for image files
    let dimensions: { width: number; height: number } | undefined;
    
    if (file.mimetype.startsWith('image/') && file.mimetype !== 'image/svg+xml') {
      try {
        const metadata = await sharp(file.buffer).metadata();
        dimensions = {
          width: metadata.width || 0,
          height: metadata.height || 0,
        };

        // Check minimum dimensions
        if (dimensions.width < 100 || dimensions.height < 100) {
          errors.push('Image dimensions must be at least 100x100 pixels');
        }

        // Check maximum dimensions
        if (dimensions.width > 10000 || dimensions.height > 10000) {
          errors.push('Image dimensions cannot exceed 10000x10000 pixels');
        }
      } catch (error) {
        errors.push('Unable to read image metadata');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      dimensions,
    };
  }

  async validateDimensions(
    file: Express.Multer.File,
    expectedDimensions: { width: number; height: number },
  ): Promise<ValidationResult> {
    const baseValidation = await this.validateFile(file);
    
    if (!baseValidation.isValid) {
      return baseValidation;
    }

    const errors = [...baseValidation.errors];

    if (baseValidation.dimensions) {
      const { width, height } = baseValidation.dimensions;
      const { width: expectedWidth, height: expectedHeight } = expectedDimensions;

      // Allow 5% tolerance
      const tolerance = 0.05;
      const widthTolerance = expectedWidth * tolerance;
      const heightTolerance = expectedHeight * tolerance;

      if (
        Math.abs(width - expectedWidth) > widthTolerance ||
        Math.abs(height - expectedHeight) > heightTolerance
      ) {
        errors.push(
          `Image dimensions ${width}x${height} do not match expected ${expectedWidth}x${expectedHeight}`
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      dimensions: baseValidation.dimensions,
    };
  }
}
