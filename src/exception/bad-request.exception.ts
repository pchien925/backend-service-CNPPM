import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  private readonly errorCode: string;

  constructor(message: string, code?: string) {
    super(message, HttpStatus.BAD_REQUEST);
    this.errorCode = code || 'ERROR-400';
  }

  getErrorCode(): string {
    return this.errorCode;
  }
}
