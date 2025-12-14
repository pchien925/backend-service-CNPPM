import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ComboGroupItemDto } from './combo-group-item.dto';

export class ComboGroupDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional({ nullable: true })
  description: string | null = null;

  @ApiProperty()
  minSelect!: number;

  @ApiProperty()
  maxSelect!: number;

  @ApiProperty()
  ordering!: number;

  @ApiProperty({ type: [ComboGroupItemDto] })
  items!: ComboGroupItemDto[];
}
