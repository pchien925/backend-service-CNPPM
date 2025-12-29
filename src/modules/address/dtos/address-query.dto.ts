import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { Paginated } from 'src/shared/dtos/paginated.dto';

export class AddressQueryDto extends Paginated {
  @ApiProperty({ description: 'ID of the account (Required)', required: true })
  @IsNotEmpty({ message: 'AccountId is required' })
  @IsString()
  accountId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  provinceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  districtId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  wardId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({ description: 'Filter by status' })
  @IsInt()
  @IsOptional()
  status?: number;
}
