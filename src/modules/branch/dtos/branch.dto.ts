import { ApiProperty } from '@nestjs/swagger';

export class BranchDto {
  @ApiProperty() id!: string;
  @ApiProperty() name!: string;
  @ApiProperty() location?: string;
  @ApiProperty() phone?: string;
  @ApiProperty() imageUrl?: string;
  @ApiProperty() status!: number;
}
