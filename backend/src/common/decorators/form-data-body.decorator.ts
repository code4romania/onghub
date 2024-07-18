import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  ValidationPipe,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { ValidationError } from 'class-validator';
import { iterate } from 'iterare';
import { flattenValidationErrors } from '../helpers/validation-error.parser';

export const RawBody = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): any => {
    const request = ctx.switchToHttp().getRequest();
    return request.body;
  },
);

/**
 * Due to "enableImplicitConversion" class transformer converts the form data boolean strings ("true", "false") to true automatically to true whitout doing the casting.
 * There is an open feature request for the library here:  https://github.com/typestack/class-transformer/issues/550
 *
 * As a workaround we parse the body without the "enableImplicitConversion" for these sepecific requests.
 */
export const FormDataBody = () =>
  RawBody(
    new ValidationPipe({
      validateCustomDecorators: true,
      whitelist: true,
      skipMissingProperties: true,
      exceptionFactory: (errors) => {
        const validationErrors = flattenValidationErrors(errors);

        Sentry.captureException(
          new Error('[ValidationPipe] FormData Validation failed'),
          {
            extra: { validationErrors: validationErrors },
          },
        );

        return new BadRequestException(flattenValidationErrors(errors));
      },
    }),
  );
