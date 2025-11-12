import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { Group } from '../group/entities/group.entity';

@Module({
  providers: [AccountService],
  controllers: [AccountController],
  imports: [TypeOrmModule.forFeature([Account, Group])],
})
export class AccountModule {}
