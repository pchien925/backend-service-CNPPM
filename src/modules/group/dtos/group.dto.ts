import { PermissionDto } from 'src/modules/permission/dtos/permission.dto';

export class GroupDto {
  id: string;
  name: string;
  description: string | null;
  kind: number;
  isSystemRole: boolean;
  permissions?: PermissionDto[];
}
