import { OptionDto } from 'src/modules/option/dtos/option.dto';

export class FoodOptionDto {
  id!: string;
  ordering!: number;
  requirementType!: number;
  maxSelect!: number;
  option: OptionDto;
}
