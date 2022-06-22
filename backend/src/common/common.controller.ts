import { Controller, Get, Post, Body, Param } from '@nestjs/common';

@Controller('')
export class CommonController {
  constructor() {}

  @Get('health')
  healthCheck() {
    return 'OK';
  }
}
