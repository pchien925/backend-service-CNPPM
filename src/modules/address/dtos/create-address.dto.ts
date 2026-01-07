import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accountId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  recipientName!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  addressLine!: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  provinceId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  districtId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  wardId!: string;
}
