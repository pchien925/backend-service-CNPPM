import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AccountModule } from './modules/account/account.module';
import { GroupModule } from './modules/group/group.module';
import { PermissionModule } from './modules/permission/permission.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AccountModule,
    GroupModule,
    PermissionModule,
  ],
})
export class AppModule {}
