import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Pagination } from 'src/common/interfaces/pagination';
import { MailService } from 'src/mail/services/mail.service';
import { ApplicationService } from '../application/services/application.service';
import { CivicCenterServiceSearchFilterDto } from '../civic-center-service/dto/civic-center-service-search-filter.dto';
import { CivicCenterService } from '../civic-center-service/entities/civic-center-service.entity';
import { GetOrganizationWithPracticeProgramsFilterDto } from '../organization/dto/get-organization-with-practice-programs-fillter.dto';
import { OrganizationFlat } from '../organization/interfaces/OrganizationFlat.interface';
import { OrganizationWithServices } from '../organization/interfaces/OrganizationWithServices.interface';
import { OrganizationService } from '../organization/services';
import { ExtractUser } from '../user/decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { Role } from '../user/enums/role.enum';
import { ContactMailDto } from './dto/contact-mail.dto';
import { HasAccessDTO } from './dto/has-access.dto';
import { HMACVerificationInterceptor } from './interceptors/hmac.interceptor';
import { PublicKeysManager } from './public-keys-manager.service';
import { PublicKeys } from './public-keys.entity';
import { CivicCenterPublicService } from './services/civic-center-public.service';

@Controller('api')
@ApiBearerAuth()
export class PublicAPIController {
  constructor(
    private readonly keysManager: PublicKeysManager,
    private readonly applications: ApplicationService,
    private readonly mailService: MailService,
    private readonly civicCenterServicePublic: CivicCenterPublicService,
    private readonly organizationService: OrganizationService,
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

  @Public()
  @Get('/civic-service/search')
  async searchCivicServices(
    @Query() civicCenterFilters: CivicCenterServiceSearchFilterDto,
  ): Promise<Pagination<CivicCenterService>> {
    return this.civicCenterServicePublic.search(civicCenterFilters);
  }

  @Public()
  @Get('/organization/services-search')
  async searchOrganizationsWithServices(
    @Query() filters: GetOrganizationWithPracticeProgramsFilterDto,
  ): Promise<Pagination<OrganizationFlat>> {
    return this.organizationService.findAllOrganizationsWithActiveServices(
      filters,
    );
  }

  @Public()
  @ApiParam({ name: 'id', type: String })
  @Get('organization/:id/service')
  findOrganizationWithServices(
    @Param('id') id: number,
  ): Promise<OrganizationWithServices> {
    return this.organizationService.findOneOrganizationWithActiveServices(id);
  }

  @Public()
  @UseInterceptors(HMACVerificationInterceptor)
  @ApiBody({ type: ContactMailDto })
  @Post('/contact/feedback')
  async sendMail(@Body() mailOptions: ContactMailDto): Promise<void> {
    await this.mailService.sendEmail({
      to: process.env.MAIL_CONTACT,
      subject: `Feedback - ${mailOptions.sender}`,
      html: `<p>${mailOptions.text}</p>`,
      ...mailOptions,
    });
  }

  @Roles(Role.SUPER_ADMIN)
  @Post('/generate-keys')
  async generateKeys(@ExtractUser() user: User): Promise<PublicKeys> {
    return this.keysManager.generateKeys(undefined, user.email);
  }
}
