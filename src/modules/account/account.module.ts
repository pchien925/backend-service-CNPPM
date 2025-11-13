import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Account } from './entities/account.entity';
import { Group } from '../group/entities/group.entity';

@Module({
  providers: [AccountService],
  controllers: [AccountController],
  imports: [
    TypeOrmModule.forFeature([Account, Group]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiresIn = parseInt(configService.get<string>('JWT_EXPIRES_IN', '604800'), 10);
        const secret = configService.get<string>('JWT_SECRET');
        return {
          secret,
          signOptions: {
            expiresIn, // 604800 giây = 7 ngày
          },
        };
      },
    }),
  ],
})
export class AccountModule {}
