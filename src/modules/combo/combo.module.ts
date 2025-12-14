import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Combo } from './entities/combo.entity';
import { ComboTag } from './entities/combo-tag.entity';
import { ComboController } from './combo.controller';
import { ComboService } from './combo.service';
import { Category } from '../category/entities/category.entity';
import { Tag } from '../tag/entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Combo, ComboTag, Category, Tag])],
  providers: [ComboService],
  controllers: [ComboController],
})
export class ComboModule {}
