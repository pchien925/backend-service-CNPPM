import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nation } from './entities/nation.entity';
import { NationController } from './nation.controller';
import { NationService } from './nation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Nation])],
  providers: [NationService],
  controllers: [NationController],
})
export class NationModule {}
