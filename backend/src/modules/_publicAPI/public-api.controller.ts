import { Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ExtractUser } from '../user/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { Role } from '../user/enums/role.enum';
import { HMACVerificationInterceptor } from './interceptors/hmac.interceptor';
import { PublicKeysManager } from './public-keys-manager.service';
import { PublicKeys } from './public-keys.entity';

@Controller('api')
@ApiBearerAuth()
export class PublicAPIController {
  constructor(private readonly keysManager: PublicKeysManager) {}

  @Public()
  @UseInterceptors(HMACVerificationInterceptor)
  @Get('/check')
  async check(): Promise<any> {
    // TODO: Florian: Implement app permissions check
    return 'OKKKKKK';
  }

  @Roles(Role.SUPER_ADMIN)
  @Post('/generate-keys')
  async generateKeys(@ExtractUser() user: User): Promise<PublicKeys> {
    return this.keysManager.generateKeys(undefined, user.email);
  }
}
