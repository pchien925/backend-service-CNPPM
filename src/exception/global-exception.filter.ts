import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { NotFoundException } from './not-found.exception';
import { BadRequestException } from './bad-request.exception';
import { UnauthorizationException } from './unauthorization.exception';
import { ForbiddenException } from './forbidden.exception';
import { CustomizeOverallException } from './customize-overall.exception';
import { ApiResponse } from 'src/shared/dtos/api-response.dto';
import { ErrorForm } from 'src/shared/dtos/error-form.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal Server Error';
    let code: string | number = 'INTERNAL_SERVER_ERROR';
    let validationErrors: ErrorForm[] | undefined = undefined;

    if (exception instanceof NotFoundException) {
      status = HttpStatus.NOT_FOUND;
      message = exception.message;
      code = exception.getErrorCode();
    } else if (exception instanceof BadRequestException) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
      code = exception.getErrorCode();
    } else if (exception instanceof UnauthorizationException) {
      status = HttpStatus.UNAUTHORIZED;
      message = exception.message;
      code = exception.getErrorCode();
    } else if (exception instanceof ForbiddenException) {
      status = HttpStatus.FORBIDDEN;
      message = exception.message;
      code = exception.getErrorCode();
    } else if (exception instanceof CustomizeOverallException) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message;
      code = exception.getCode();
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      if (status === HttpStatus.NOT_FOUND && !exception.message) {
        message = '[Ex3]: 404';
        code = 'ERROR handleNoHandlerFoundException';
      } else if (
        status === HttpStatus.BAD_REQUEST &&
        typeof errorResponse === 'object' &&
        Array.isArray(errorResponse['message'])
      ) {
        // Xử lý lỗi từ ValidationPipe
        message = 'Data validation error.';
        code = 'ERROR-400-VALIDATION'; // Ánh xạ lỗi ValidationPipe về định dạng ErrorForm
        const validationData = errorResponse['message'] as { field: string; error: string }[];
        validationErrors = validationData.map(err => ({
          fieldName: err.field,
          errorMessage: err.error,
        }));
      } else {
        message =
          typeof errorResponse === 'string'
            ? errorResponse
            : errorResponse['message'] || 'Bad request';
        code = status;
      }
    } else if (exception instanceof Error) {
      status = HttpStatus.BAD_REQUEST;
      message = `[Ex2]: ${exception.message}`;
      code = 'ERROR';
    }

    const errorBody = ApiResponse.fail(message, code, validationErrors);

    response.status(status).json(errorBody);
  }
}
