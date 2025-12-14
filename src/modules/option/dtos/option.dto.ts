import { OptionValueDto } from './option-value.dto';

export class OptionDto {
  id!: string;
  name!: string;
  description: string | null = null;
  status!: number;
  values?: OptionValueDto[];
}
