import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizationException extends HttpException {
  private readonly errorCode: string;

  constructor(message: string, code?: string) {
    super(message, HttpStatus.UNAUTHORIZED);
    this.errorCode = code || 'ERROR';
  }

  getErrorCode(): string {
    return this.errorCode;
  }
}
