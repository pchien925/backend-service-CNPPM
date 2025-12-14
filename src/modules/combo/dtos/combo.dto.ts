import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoryDto } from 'src/modules/category/dtos/category.dto';
import { TagDto } from 'src/modules/tag/dtos/tag.dto';

export class ComboDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional({ nullable: true })
  description: string | null = null;

  @ApiProperty()
  basePrice!: number;

  @ApiPropertyOptional({ nullable: true })
  imageUrl: string | null = null;

  @ApiPropertyOptional({ nullable: true })
  cookingTime: number | null = null;

  @ApiProperty()
  ordering!: number;

  @ApiProperty()
  status!: number;

  @ApiProperty({ type: CategoryDto })
  category!: CategoryDto;

  @ApiPropertyOptional({ type: [TagDto] })
  tags?: TagDto[];
}
