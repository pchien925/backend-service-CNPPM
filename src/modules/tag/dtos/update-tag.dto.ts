import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateTagDto } from './create-tag.dto';

export class UpdateTagDto extends PartialType(CreateTagDto) {
  @ApiProperty()
  @IsNotEmpty({ message: 'ID cannot be null' })
  @IsString()
  id!: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  status?: number;
}
