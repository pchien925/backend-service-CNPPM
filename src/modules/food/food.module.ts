import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Food } from './entities/food.entity';
import { FoodTag } from './entities/food-tag.entity';
import { FoodOption } from './entities/food-option.entity';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { Category } from 'src/modules/category/entities/category.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { Option } from 'src/modules/option/entities/option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Food, FoodTag, FoodOption, Category, Tag, Option])],
  providers: [FoodService],
  controllers: [FoodController],
  exports: [FoodService],
})
export class FoodModule {}
