export class OptionValueDto {
  id!: string;
  name!: string;
  description: string | null = null;
  extraPrice!: number;
  ordering!: number;
  status!: number;
}
