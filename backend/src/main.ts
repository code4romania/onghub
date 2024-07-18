import './instrument';
import * as Sentry from '@sentry/node';
import {
  BaseExceptionFilter,
  HttpAdapterHost,
  NestFactory,
} from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Environment } from './env.validation';
import helmet from 'helmet';
import { GlobalExceptionFilter } from './common/exceptions/filters/global-exception.filter';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { createQueueMonitoring } from 'src/libs/bull-board';
import { flattenValidationErrors } from './common/helpers/validation-error.parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
    bufferLogs: true,
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  Sentry.setupNestErrorHandler(app, new BaseExceptionFilter(httpAdapter));

  app.use(helmet());

  app.enableCors({
    exposedHeaders: 'content-disposition', // Allow header in the Axios Response Headers
  });

  app.useLogger(app.get(Logger));

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

  app.use('/admin/queues', createQueueMonitoring(app).getRouter());

  // Create swagger module only local or development
  if (!(process.env.NODE_ENV === Environment.Production)) {
    const options = new DocumentBuilder()
      .setTitle('NGO Hub backend')
      .setDescription('NGO Hub backend')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }

  const PORT = +process.env.PORT || 3001;

  await app.listen(PORT).then(() => {
    console.log(`App running on: http://localhost:${PORT}`);
    console.log(
      `Swagger documentation available at: http://localhost:${PORT}/api`,
    );
  });
}
bootstrap();
