import * as Sentry from '@sentry/node';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from './common/exceptions/filters/global-exception.filter';
import { flattenValidationErrors } from './common/helpers/validation-error.parser';
import { mountOidc } from './modules/oidc/oidc.mount';

/**
 * Everything the HTTP app needs besides AppModule, shared by main.ts and the
 * e2e harness (test/utils/test-app.ts) so tests run the same pipeline.
 * Must run before app.init()/listen(): mountOidc relies on that order.
 */
export function setupApp(app: NestExpressApplication): void {
  // Behind the ALB (maybe also CloudFront): number of proxy hops to trust for
  // req.ip / req.ips (used by ThrottlerGuardByIP). Without it every request
  // appears to come from the load balancer. Hop count confirmed in T0.
  app.set('trust proxy', Number(process.env.TRUST_PROXY_HOPS ?? 1));

  app.use(helmet());
  app.use(cookieParser());

  // Before any Nest middleware/router (registered at init): see oidc.mount.ts
  mountOidc(app);

  app.enableCors({
    exposedHeaders: 'content-disposition', // Allow header in the Axios Response Headers
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: false,

      exceptionFactory: (errors) => {
        const validationErrors = flattenValidationErrors(errors);

        Sentry.captureException(
          new Error('[ValidationPipe] Validation failed'),
          {
            extra: { validationErrors: validationErrors },
          },
        );

        return new BadRequestException(flattenValidationErrors(errors));
      },
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());
}
