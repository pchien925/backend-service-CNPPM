import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateBranchDto } from './create-branch.dto';

export class UpdateBranchDto extends PartialType(CreateBranchDto) {
  @ApiProperty()
  @IsNotEmpty({ message: 'ID cannot be null' })
  @IsString()
  id!: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  status?: number;
}
