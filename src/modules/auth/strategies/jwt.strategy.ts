import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorCode } from 'src/constants/error-code.constant';
import { UserDetailsDto } from '../dtos/user-details.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    try {
      const userId = payload.sub || payload.id;
      if (!userId) {
        throw new UnauthorizedException('Invalid token payload', ErrorCode.AUTH_ERROR_UNAUTHORIZED);
      }
      const user = new UserDetailsDto(
        userId,
        payload.username,
        payload.kind,
        payload.authorities,
        payload.isSuperAdmin,
      );
      return user;
    } catch (error) {
      console.error(`JWT validation failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}
