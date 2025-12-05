import { OptionValueDto } from './option-value.dto';

export class OptionDto {
  id!: number;
  name!: string;
  description: string | null = null;
  status!: number;
  values?: OptionValueDto[];
}
