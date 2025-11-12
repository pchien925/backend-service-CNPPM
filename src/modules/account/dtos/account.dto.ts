import { GroupDto } from 'src/modules/group/dtos/group.dto';

export class AccountDto {
  id: number;
  username: string;
  email: string;
  phone?: string;
  fullName: string;
  avatarPath?: string;
  group?: GroupDto;
}
