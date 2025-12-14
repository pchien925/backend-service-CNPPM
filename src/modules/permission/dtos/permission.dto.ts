import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PermissionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  permissionCode: string;

  @ApiProperty()
  action: string;

  @ApiProperty()
  showMenu: boolean;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  nameGroup: string;
}
