import { OptionValueDto } from 'src/modules/option/dtos/option-value.dto';

export class FoodOptionDto {
  id!: number;
  name!: string;
  ordering!: number;
  requirementType!: number;
  maxSelect!: number;
  optionValues?: OptionValueDto[];
}
