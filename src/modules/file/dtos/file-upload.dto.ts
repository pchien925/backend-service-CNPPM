import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary', description: 'The file to upload' })
  file: any;

  @ApiProperty({ example: 'AVATAR', description: 'Folder name/category for the file' })
  type: string;
}
