import { OptionValueDto } from 'src/modules/option/dtos/option-value.dto';

export class CartItemOptionDto {
  id: string;
  extraPrice: number;
  optionValue: OptionValueDto;
}
