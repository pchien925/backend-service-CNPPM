import { PermissionDto } from 'src/modules/permission/dtos/permission.dto';

export class GroupDto {
  id: number;
  name: string;
  description: string | null;
  kind: number;
  permissions?: PermissionDto[];
}
