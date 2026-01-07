import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../category/entities/category.entity';
import { Food } from '../food/entities/food.entity';
import { Tag } from '../tag/entities/tag.entity';
import { ComboGroupController } from './combo-group.controller';
import { ComboGroupService } from './combo-group.service';
import { ComboController } from './combo.controller';
import { ComboService } from './combo.service';
import { ComboGroupItem } from './entities/combo-group-item.entity';
import { ComboGroup } from './entities/combo-group.entity';
import { ComboTag } from './entities/combo-tag.entity';
import { Combo } from './entities/combo.entity';
import { ComboGroupItemController } from './combo-group-item.controller';
import { ComboGroupItemService } from './combo-group-item.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Combo, ComboTag, Category, Tag, ComboGroup, ComboGroupItem, Food]),
  ],
  providers: [ComboService, ComboGroupService, ComboGroupItemService],
  controllers: [ComboController, ComboGroupController, ComboGroupItemController],
})
export class ComboModule {}
