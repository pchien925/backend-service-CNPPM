import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateTagDto } from './create-tag.dto';

export class UpdateTagDto extends PartialType(CreateTagDto) {
  @ApiProperty()
  @IsInt()
  @IsNotEmpty()
  id!: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  status?: number;
}
