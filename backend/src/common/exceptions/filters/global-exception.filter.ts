import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { TypeORMError, QueryFailedError } from 'typeorm';
import { GlobalResponseError } from '../models/global-reponse-error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(
    exception: HttpException | TypeORMError | unknown,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let message = (exception as any).message;
    let code = 'HttpException';
    let stack = {};

    Logger.error(
      message,
      (exception as any).stack,
      `${request.method} ${request.url}`,
    );

    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      status = (exception as HttpException).getStatus();
      message = (exception as HttpException).getResponse()['message'];
      code = (exception as HttpException).getResponse()['errorCode'];
      stack = (exception as HttpException).getResponse();
    } else if (exception instanceof TypeORMError) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = (exception as TypeORMError).message;
      code = (exception as any).code;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const responseToUser = GlobalResponseError(
      status,
      message,
      code,
      request,
      stack,
    );

    response.status(status).json(responseToUser);
  }
}
