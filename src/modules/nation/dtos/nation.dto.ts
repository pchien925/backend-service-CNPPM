import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NationDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiPropertyOptional({ nullable: true })
  postalCode: string | null = null;

  @ApiProperty({ description: '1: ward, 2: district, 3: province' })
  kind!: number;

  @ApiProperty()
  status!: number;

  @ApiPropertyOptional({ type: NationDto, nullable: true })
  parent?: NationDto | null;
}
