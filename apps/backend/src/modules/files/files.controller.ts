import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FilesService } from './files.service';
import { multerConfig } from './config/multer.config';

@ApiTags('files')
@Controller('files')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload file for printing' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
    @Body() body: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const expectedDimensions = body.width && body.height 
      ? { width: parseInt(body.width), height: parseInt(body.height) }
      : undefined;

    return await this.filesService.uploadFile(
      file,
      req.user.id,
      expectedDimensions
    );
  }

  @Get()
  @ApiOperation({ summary: 'List all user files' })
  async listFiles(@Request() req) {
    return await this.filesService.listFiles(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get file details' })
  async getFile(@Param('id') id: string, @Request() req) {
    return await this.filesService.getFile(id, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete file' })
  async deleteFile(@Param('id') id: string, @Request() req) {
    return await this.filesService.deleteFile(id, req.user.id);
  }
}
