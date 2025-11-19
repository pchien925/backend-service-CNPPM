import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Group } from '../group/entities/group.entity';
import { EmailService } from 'src/shared/services/email/email.service';

@Module({
  providers: [AccountService, EmailService],
  controllers: [AccountController],
  imports: [TypeOrmModule.forFeature([Account, Group])],
  exports: [AccountService],
})
export class AccountModule {}
