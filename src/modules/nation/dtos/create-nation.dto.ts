import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateNationDto {
  @ApiProperty({ description: 'Nation name' })
  @IsNotEmpty({ message: 'Name cannot be null' })
  @IsString({ message: 'Name must be a string' })
  name!: string;

  @ApiPropertyOptional({ description: 'Postal code (Zip code)' })
  @IsOptional()
  @IsString({ message: 'Postal code must be a string' })
  postalCode?: string;

  @ApiProperty({ description: 'Nation kind (1: ward, 2: district, 3: province)' })
  @IsNotEmpty()
  @IsInt({ message: 'Kind must be an integer' })
  @Min(1, { message: 'Kind must be >= 1' })
  kind!: number;

  @ApiPropertyOptional({ description: 'ID of the parent nation' })
  @IsOptional()
  @IsString({ message: 'Parent ID must be a string' })
  parentId?: string;
}
