import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as sharp from 'sharp';

@Injectable()
export class StorageService {
  private readonly uploadDir = './uploads/files';
  private readonly thumbnailDir = './uploads/thumbnails';

  async storeFile(file: Express.Multer.File, filename: string): Promise<string> {
    const filePath = path.join(this.uploadDir, filename);
    
    // Ensure directory exists
    await fs.mkdir(this.uploadDir, { recursive: true });
    
    // Write file
    await fs.writeFile(filePath, file.buffer);
    
    // Generate thumbnail for images
    if (file.mimetype.startsWith('image/') && file.mimetype !== 'image/svg+xml') {
      await this.generateThumbnail(file.buffer, filename);
    }
    
    return filePath;
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
      
      // Also delete thumbnail if it exists
      const filename = path.basename(filePath);
      const thumbnailPath = path.join(this.thumbnailDir, filename);
      
      try {
        await fs.unlink(thumbnailPath);
      } catch (error) {
        // Thumbnail might not exist, ignore error
      }
    } catch (error) {
      // File might not exist, ignore error
    }
  }

  async getFileStream(filePath: string): Promise<NodeJS.ReadableStream> {
    const fs = require('fs');
    return fs.createReadStream(filePath);
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  private async generateThumbnail(buffer: Buffer, filename: string): Promise<void> {
    try {
      await fs.mkdir(this.thumbnailDir, { recursive: true });
      
      const thumbnailPath = path.join(this.thumbnailDir, filename);
      
      await sharp(buffer)
        .resize(300, 300, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);
    } catch (error) {
      console.error('Failed to generate thumbnail:', error);
    }
  }

  getThumbnailPath(filename: string): string {
    return path.join(this.thumbnailDir, filename);
  }

  getFilePath(filename: string): string {
    return path.join(this.uploadDir, filename);
  }
}
