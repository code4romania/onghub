import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';

@Module({
  controllers: [ApplicationController]
})
export class ApplicationModule {}
