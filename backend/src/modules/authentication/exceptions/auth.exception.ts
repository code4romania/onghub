import { HttpException, HttpStatus } from '@nestjs/common';

/** Same numbering as VIC 2.0 where the meaning is the same. */
export enum AuthErrorCode {
  AUTH_004 = 'AUTH_004',
  AUTH_005 = 'AUTH_005',
  AUTH_006 = 'AUTH_006',
  AUTH_008 = 'AUTH_008',
  AUTH_010 = 'AUTH_010',
  AUTH_015 = 'AUTH_015',
}

const AUTH_ERRORS: Record<AuthErrorCode, { message: string; status: number }> =
  {
    [AuthErrorCode.AUTH_004]: {
      message: 'Account or organization restricted',
      status: HttpStatus.FORBIDDEN,
    },
    [AuthErrorCode.AUTH_005]: {
      message: 'Token or link invalid, expired or already used',
      status: HttpStatus.BAD_REQUEST,
    },
    [AuthErrorCode.AUTH_006]: {
      message: 'Too many wrong codes, request a new one',
      status: HttpStatus.BAD_REQUEST,
    },
    [AuthErrorCode.AUTH_008]: {
      message: 'Session expired or invalid',
      status: HttpStatus.UNAUTHORIZED,
    },
    [AuthErrorCode.AUTH_010]: {
      message: 'Too many requests, try again later',
      status: HttpStatus.TOO_MANY_REQUESTS,
    },
    [AuthErrorCode.AUTH_015]: {
      message: 'Wrong code',
      status: HttpStatus.BAD_REQUEST,
    },
  };

/** Body `{ message, errorCode }`, like every other NGO Hub business error. */
export class AuthException extends HttpException {
  constructor(public readonly code: AuthErrorCode) {
    super(
      { message: AUTH_ERRORS[code].message, errorCode: code },
      AUTH_ERRORS[code].status,
    );
  }
}
