import { Controller, Get } from '@nestjs/common';

@Controller('')
export class SharedController {
  constructor() {}

  @Get('health')
  healthCheck() {
    return 'OK';
  }

  @Get('version')
  version() {
    return 'v0.0.1';
  }
}
