import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTagDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name!: string;

  @ApiProperty({ description: 'Tag color (ex: #FF0000)', required: false, example: '#FF0000' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  color?: string;
}
