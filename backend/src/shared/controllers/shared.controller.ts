import { Controller, Get, Query } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from 'src/common/decorators/public.decorator';
import { FileManagerService } from '../services/file-manager.service';

@Public()
@Controller('')
export class SharedController {
  constructor(private readonly fileManagerService: FileManagerService) {}

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

  @Public()
  @Get('file')
  getFile(@Query('path') path: string): Promise<string> {
    return this.fileManagerService.generatePresignedURL(path);
  }
}
