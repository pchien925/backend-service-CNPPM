import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateOptionDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Name cannot be null' })
  @IsString()
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Description cannot be null' })
  @IsString()
  description?: string;
}
