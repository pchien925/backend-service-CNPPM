import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOptionDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Name cannot be null' })
  @IsString()
  name!: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Description cannot be null' })
  @IsString()
  description?: string;
}
