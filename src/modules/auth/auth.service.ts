import { Injectable } from '@nestjs/common';
import { AccountService } from '../account/account.service';
import { UserDetailsDto } from './dtos/user-details.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  async login(user: UserDetailsDto) {
    const payload = {
      sub: user.id,
      id: user.id,
      username: user.username,
      kind: user.kind,
      authorities: user.authorities,
      isSuperAdmin: user.isSuperAdmin,
    };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user,
    };
  }

  async validateUser(username: string, password: string): Promise<UserDetailsDto | null> {
    return this.accountService.validateCredentials(username, password);
  }
}
