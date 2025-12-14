export class UserDetailsDto {
  id: string;
  username: string;
  kind: number;
  authorities: string[];
  isSuperAdmin: boolean;

  constructor(
    id: string,
    username: string,
    kind: number,
    authorities: string[],
    isSuperAdmin: boolean,
  ) {
    this.id = id;
    this.username = username;
    this.kind = kind;
    this.authorities = authorities;
    this.isSuperAdmin = isSuperAdmin;
  }
}
