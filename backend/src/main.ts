import './instrument';
import * as Sentry from '@sentry/node';
import {
  BaseExceptionFilter,
  HttpAdapterHost,
  NestFactory,
} from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { setupApp } from './app.setup';
import { Environment } from './env.validation';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';
import { createQueueMonitoring } from 'src/libs/bull-board';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
    bufferLogs: true,
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  Sentry.setupNestErrorHandler(app, new BaseExceptionFilter(httpAdapter));

  setupApp(app);

  app.useLogger(app.get(Logger));

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
