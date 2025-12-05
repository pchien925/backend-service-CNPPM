import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  private readonly errorCode: string;

  constructor(message: string, code?: string) {
    super(message, HttpStatus.FORBIDDEN);
    this.errorCode = code || 'ERROR';
  }

  getErrorCode(): string {
    return this.errorCode;
  }
}
