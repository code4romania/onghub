import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from 'src/common/decorators/public.decorator';
import { S3FileManagerService } from '../services/s3-file-manager.service';

@Public()
@Controller('')
export class SharedController {
  constructor(private readonly fileManagerService: S3FileManagerService) {}

  @SkipThrottle()
  @Get('health')
  healthCheck() {
    return 'OK';
  }

  @Get('version')
  version() {
    return 'v0.0.2';
  }

  @Public()
  @Get('public/partners')
  partners() {
    return this.fileManagerService.generatePresignedURL(
      'static/Lista_parteneri_2021.xlsx',
    );
  }

  @Public()
  @Get('public/investors')
  investors() {
    return this.fileManagerService.generatePresignedURL(
      'static/Lista_finantatori_2021.xlsx',
    );
  }

  @ApiQuery({ name: 'path', type: String })
  @Public()
  @Get('file')
  getFile(@Query('path') path: string): Promise<string> {
    return this.fileManagerService.generatePresignedURL(path);
  }
}
