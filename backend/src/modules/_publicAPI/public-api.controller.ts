import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApplicationService } from '../application/services/application.service';
import { ExtractUser } from '../user/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { Role } from '../user/enums/role.enum';
import { HasAccessDTO } from './dto/has-access.dto';
import { HMACVerificationInterceptor } from './interceptors/hmac.interceptor';
import { PublicKeysManager } from './public-keys-manager.service';
import { PublicKeys } from './public-keys.entity';

@Controller('api')
@ApiBearerAuth()
export class PublicAPIController {
  constructor(
    private readonly keysManager: PublicKeysManager,
    private readonly applications: ApplicationService,
  ) {}

  @Public()
  @UseInterceptors(HMACVerificationInterceptor)
  @HttpCode(200)
  @Post('/hasAccess')
  async check(
    @Body() { applicationClientId, userId }: HasAccessDTO,
  ): Promise<boolean> {
    return this.applications.hasAccess(applicationClientId, userId);
  }

  @Roles(Role.SUPER_ADMIN)
  @Post('/generate-keys')
  async generateKeys(@ExtractUser() user: User): Promise<PublicKeys> {
    return this.keysManager.generateKeys(undefined, user.email);
  }
}
