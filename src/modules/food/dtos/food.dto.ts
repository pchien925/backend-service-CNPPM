import { CategoryDto } from 'src/modules/category/dtos/category.dto';
import { TagDto } from 'src/modules/tag/dtos/tag.dto';
import { FoodOptionDto } from './food-option.dto';

export class FoodDto {
  id!: string;
  name!: string;
  description: string | null = null;
  basePrice!: number;
  imageUrl: string | null = null;
  cookingTime: number | null = null;
  ordering!: number;
  status!: number;

  category!: CategoryDto;

  tags!: TagDto[];

  options!: FoodOptionDto[];
}
