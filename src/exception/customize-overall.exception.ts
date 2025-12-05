import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomizeOverallException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  getCode(): string {
    return 'internalServerError';
  }
}
