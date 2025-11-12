import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty({ default: true })
  result: boolean;

  @ApiPropertyOptional()
  data?: T;

  @ApiProperty()
  message: string;

  @ApiPropertyOptional()
  code?: string | number;

  constructor(data: T, message = '', code?: string | number, result = true) {
    this.data = data;
    this.message = message;
    this.code = code;
    this.result = result;
  }

  static successMessage<T>(message = 'Success'): ApiResponse<T> {
    return new ApiResponse<T>(null as any, message, undefined, true);
  }

  static success<T>(data: T, message = 'Success', code?: string | number): ApiResponse<T> {
    return new ApiResponse<T>(data, message, code, true);
  }

  static fail<T>(message = 'Failed', code?: string | number): ApiResponse<T> {
    return new ApiResponse<T>(null as any, message, code, false);
  }
}
