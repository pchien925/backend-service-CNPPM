import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  private readonly errorCode: string;

  constructor(message: string, code?: string) {
    super(message, HttpStatus.NOT_FOUND);
    this.errorCode = code || 'ERROR';
  }

  getErrorCode(): string {
    return this.errorCode;
  }
}
