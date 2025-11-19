import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AccountModule } from './modules/account/account.module';
import { GroupModule } from './modules/group/group.module';
import { PermissionModule } from './modules/permission/permission.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './configs/jwt.config';
import { mailerConfig } from './configs/email.config';
import { AuthModule } from './modules/auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRootAsync(mailerConfig),
    JwtModule.registerAsync(jwtConfig),
    DatabaseModule,
    AccountModule,
    GroupModule,
    PermissionModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
