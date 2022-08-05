import { Request } from 'express';

interface IResponseError {
  statusCode: number;
  message: string;
  code: string;
  timestamp: string;
  path: string;
  method: string;
  error: any;
}

export const GlobalResponseError: (
  statusCode: number,
  message: string,
  code: string,
  request: Request,
  error: any,
) => IResponseError = (
  statusCode: number,
  message: string,
  code: string,
  request: Request,
  error: any,
): IResponseError => {
  return {
    statusCode: statusCode,
    message,
    code,
    timestamp: new Date().toISOString(),
    path: request.url,
    method: request.method,
    error: error,
  };
};
