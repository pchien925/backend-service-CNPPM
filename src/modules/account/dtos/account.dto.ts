import { GroupDto } from 'src/modules/group/dtos/group.dto';

export class AccountDto {
  id: string;
  username: string;
  email: string;
  phone?: string;
  fullName: string;
  avatarPath?: string;
  isSuperAdmin: boolean;
  status: number;
  kind: number;
  group?: GroupDto;
}
