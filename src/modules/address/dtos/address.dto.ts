export class AddressDto {
  id!: string;
  recipientName!: string;
  phone!: string;
  addressLine!: string;
  isDefault!: boolean;
  province?: any;
  district?: any;
  ward?: any;
  status?: number;
}
