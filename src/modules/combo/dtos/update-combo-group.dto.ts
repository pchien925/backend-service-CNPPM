import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateComboGroupItemDto } from './create-combo-group-item.dto';
import { UpdateComboGroupItemDto } from './update-combo-group-item.dto';

export class UpdateComboGroupDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString({ message: 'ID must be a string' })
  id!: string;

  @ApiProperty({ description: 'ID of the parent combo' })
  @IsString({ message: 'Combo ID must be a string' })
  @IsNotEmpty({ message: 'Combo ID is required' })
  comboId!: string;

  @ApiPropertyOptional()
  @IsString({ message: 'Name must be a string' })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsInt({ message: 'Min select must be an integer' })
  @Min(0)
  @IsOptional()
  minSelect?: number;

  @ApiPropertyOptional({ default: 1 })
  @IsInt({ message: 'Max select must be an integer' })
  @Min(1)
  @IsOptional()
  maxSelect?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsInt({ message: 'Ordering must be an integer' })
  @IsOptional()
  ordering?: number;

  @ApiPropertyOptional({ description: 'Filter by status (1: Active, 0: Inactive)' })
  @IsInt({ message: 'Status must be an integer' })
  @IsOptional()
  status?: number;

  @ApiPropertyOptional({ description: 'Items to be updated' })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateComboGroupItemDto)
  updateItems?: UpdateComboGroupItemDto[];

  @ApiPropertyOptional({ description: 'New items to be created' })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateComboGroupItemDto)
  newItems?: CreateComboGroupItemDto[];
}
