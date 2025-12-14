import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, ArrayUnique, IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Name cannot be null' })
  @IsString()
  name!: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Description cannot be null' })
  @IsString()
  description!: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Permissions cannot be null' })
  @IsArray()
  @ArrayNotEmpty({ message: 'Permissions cannot be empty' })
  @ArrayUnique({ message: 'Permissions must be unique' })
  @IsString({ each: true, message: 'Each permission must be a string' })
  permissions!: string[];

  @ApiProperty()
  @IsNotEmpty({ message: 'Kind cannot be null' })
  @IsInt()
  kind!: number;
}
