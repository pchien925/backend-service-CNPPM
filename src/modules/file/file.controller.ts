import {
  BadRequestException,
  Body,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ApiController } from 'src/common/decorators/api-controller.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { FileUploadDto } from './dtos/file-upload.dto';
import { FileService } from './file.service';
import { randomUUID } from 'crypto';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Files')
@ApiController('file', { auth: true })
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @Permissions('FILE_U')
  @ApiOperation({ summary: 'Upload file to a specific category folder' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const baseDir = process.env.UPLOAD_DIR || 'D:/uploads';
          const type = req.body.type || 'others';
          const safeType = type.replace(/[^a-z0-9_-]/gi, '_');

          const uploadPath = join(baseDir, safeType);

          if (!existsSync(uploadPath)) {
            mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          cb(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: FileUploadDto,
  ): Promise<ApiResponse<any>> {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const result = await this.fileService.handleUploadSuccess(file, dto.type);
    return ApiResponse.success(result, 'File uploaded successfully');
  }

  @Get('download/:type/:filename')
  @Public()
  @ApiOperation({ summary: 'Download file by path' })
  async download(
    @Param('type') type: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const filePath = await this.fileService.getFilePath(type, filename);

    return res.download(filePath, filename, err => {
      if (err) {
        if (!res.headersSent) {
          res.status(404).send('File not found');
        }
      }
    });
  }
}
