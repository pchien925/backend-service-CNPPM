import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional({ nullable: true })
  description: string | null = null;

  @ApiProperty()
  kind!: number;

  @ApiPropertyOptional({ nullable: true })
  imageUrl: string | null = null;

  @ApiProperty()
  ordering?: number;

  @ApiProperty()
  status?: number;

  @ApiPropertyOptional({
    type: [CategoryDto],
    description: 'List of child categories',
    nullable: true,
  })
  children?: CategoryDto[];
}
