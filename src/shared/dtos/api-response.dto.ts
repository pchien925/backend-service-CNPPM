import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty({ default: true })
  result: boolean = true;

  @ApiPropertyOptional()
  data?: T;

  @ApiProperty({ default: 'Success' })
  message: string = 'Success';

  @ApiPropertyOptional({ default: HttpStatus.OK })
  code?: string | number = HttpStatus.OK;

  constructor(data: T, message = '', code?: string | number, result = true) {
    this.data = data;
    this.message = message;
    this.code = code;
    this.result = result;
  }

  static successMessage<T>(message = 'Success'): ApiResponse<T> {
    return new ApiResponse<T>(null as any, message, HttpStatus.OK, true);
  }

  static success<T>(
    data: T,
    message = 'Success',
    code: string | number = HttpStatus.OK,
  ): ApiResponse<T> {
    return new ApiResponse<T>(data, message, code, true);
  }

  static fail<T>(
    message = 'Failed',
    code: string | number = HttpStatus.BAD_REQUEST,
  ): ApiResponse<T> {
    return new ApiResponse<T>(null as any, message, code, false);
  }
}
