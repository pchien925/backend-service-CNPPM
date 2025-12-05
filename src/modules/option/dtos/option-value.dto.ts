export class OptionValueDto {
  id!: number;
  name!: string;
  description: string | null = null;
  extraPrice!: number;
  ordering!: number;
  status!: number;
}
