import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

export interface UserContext {
  id: string;
  username: string;
  kind: number;
  authorities: string[];
  isSuperAdmin: boolean;
}

@Injectable()
export class UserContextHelper {
  private static clsInstance: ClsService;

  constructor(private readonly cls: ClsService) {
    UserContextHelper.clsInstance = cls;
  }

  private static getCls(): ClsService {
    if (!UserContextHelper.clsInstance) {
      throw new InternalServerErrorException(
        'ClsService not initialized. Ensure UserContextHelper is provided globally.',
      );
    }
    return UserContextHelper.clsInstance;
  }

  public static getUser(): UserContext | undefined {
    return UserContextHelper.getCls().get<UserContext>('user');
  }

  public static getId(): string {
    return UserContextHelper.getUser()?.id ?? null;
  }

  public static getUsername(): string {
    return UserContextHelper.getUser()?.username ?? null;
  }

  public static getKind(): number {
    return UserContextHelper.getUser()?.kind ?? 0;
  }

  public static getAuthorities(): string[] {
    return UserContextHelper.getUser()?.authorities ?? [];
  }

  public static isSuperAdmin(): boolean {
    return UserContextHelper.getUser()?.isSuperAdmin === true;
  }

  public static hasAuthority(authority: string): boolean {
    const authorities = UserContextHelper.getAuthorities();
    return authorities.includes(authority);
  }
}
