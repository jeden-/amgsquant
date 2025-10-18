import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FileValidatorService } from './file-validator.service';
import { StorageService } from './storage.service';
import { PreflightStatus } from '@prisma/client';

@Injectable()
export class FilesService {
  constructor(
    private prisma: PrismaService,
    private fileValidator: FileValidatorService,
    private storage: StorageService,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    expectedDimensions?: { width: number; height: number },
  ) {
    // Validate file
    const validationResult = await this.fileValidator.validateFile(file);
    
    if (!validationResult.isValid) {
      throw new Error(`File validation failed: ${validationResult.errors.join(', ')}`);
    }

    // Generate unique filename
    const fileExtension = file.originalname.split('.').pop();
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

    // Store file
    const filePath = await this.storage.storeFile(file, uniqueFilename);

    // Create database record
    const fileRecord = await this.prisma.file.create({
      data: {
        userId,
        originalName: file.originalname,
        storagePath: filePath,
        mimeType: file.mimetype,
        size: file.size,
        width: validationResult.dimensions?.width,
        height: validationResult.dimensions?.height,
        preflightStatus: PreflightStatus.PENDING,
      },
    });

    // Start preflight check
    this.performPreflightCheck(fileRecord.id);

    return fileRecord;
  }

  async listFiles(userId: string) {
    return await this.prisma.file.findMany({
      where: { userId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async getFile(fileId: string, userId: string) {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    if (file.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return file;
  }

  async deleteFile(fileId: string, userId: string) {
    const file = await this.getFile(fileId, userId);

    // Delete physical file
    await this.storage.deleteFile(file.storagePath);

    // Delete database record
    await this.prisma.file.delete({
      where: { id: fileId },
    });

    return { message: 'File deleted successfully' };
  }

  private async performPreflightCheck(fileId: string) {
    try {
      // Update status to processing
      await this.prisma.file.update({
        where: { id: fileId },
        data: { preflightStatus: PreflightStatus.PROCESSING },
      });

      // Perform actual preflight check
      const file = await this.prisma.file.findUnique({
        where: { id: fileId },
      });

      if (file) {
        // Simulate preflight check
        const isValid = Math.random() > 0.1; // 90% success rate for demo

        await this.prisma.file.update({
          where: { id: fileId },
          data: {
            preflightStatus: isValid ? PreflightStatus.APPROVED : PreflightStatus.REJECTED,
            preflightReport: isValid ? null : { errors: ['File format not supported'] },
          },
        });
      }
    } catch (error) {
      await this.prisma.file.update({
        where: { id: fileId },
        data: {
          preflightStatus: PreflightStatus.REJECTED,
          preflightReport: { errors: ['Preflight check failed'] },
        },
      });
    }
  }
}
