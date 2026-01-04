import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Paginated } from 'src/shared/dtos/paginated.dto';

export class ComboGroupItemQueryDto extends Paginated {
  @ApiProperty({ description: 'ID của nhóm combo (Bắt buộc)' })
  @IsNotEmpty({ message: 'Combo Group ID is required' })
  @IsString()
  comboGroupId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  foodId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  status?: number;
}
