import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { existsSync } from 'fs';
import { NotFoundException } from 'src/exception/not-found.exception';
import { BadRequestException } from 'src/exception/bad-request.exception';
import { ErrorCode } from 'src/constants/error-code.constant';

@Injectable()
export class FileService {
  async handleUploadSuccess(file: Express.Multer.File, type: string) {
    if (!file) {
      throw new BadRequestException('File upload failed', ErrorCode.FILE_ERROR_UPLOAD_FAILED);
    }

    return {
      fileName: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      filePath: `${type}/${file.filename}`,
      size: file.size,
    };
  }

  async getFilePath(type: string, filename: string): Promise<string> {
    if (type.includes('..') || filename.includes('..')) {
      throw new BadRequestException('Invalid file path', ErrorCode.FILE_ERROR_INVALID_PATH);
    }

    const baseDir = process.env.UPLOAD_DIR || 'D:/uploads';

    const safeType = type.replace(/[^a-z0-9_-]/gi, '_');

    const filePath = join(baseDir, safeType, filename);

    if (!existsSync(filePath)) {
      throw new NotFoundException('File does not exist on server', ErrorCode.FILE_ERROR_NOT_FOUND);
    }

    return filePath;
  }
}
