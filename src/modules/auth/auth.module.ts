import { Module } from '@nestjs/common';
import { AccountModule } from '../account/account.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { EmailService } from 'src/shared/services/email/email.service';

@Module({
  providers: [AuthService, EmailService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  imports: [AccountModule],
})
export class AuthModule {}
