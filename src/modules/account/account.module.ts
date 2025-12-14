import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from '../group/entities/group.entity';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { Account } from './entities/account.entity';

@Module({
  providers: [AccountService],
  controllers: [AccountController],
  imports: [TypeOrmModule.forFeature([Account, Group])],
  exports: [AccountService, TypeOrmModule],
})
export class AccountModule {}
