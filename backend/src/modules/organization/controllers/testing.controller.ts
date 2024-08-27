import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTooManyRequestsResponse } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/modules/user/enums/role.enum';
import { OrganizationCronsService } from '../services/crons.service';

@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('testing')
export class TestingController {
  constructor(
    private readonly organizationCronsService: OrganizationCronsService,
  ) {}

  @Roles(Role.SUPER_ADMIN)
  @Post('generate-reports-1st-january')
  generateReports(): Promise<unknown> {
    return this.organizationCronsService.generateFinancialDataAndReportsForPreviousYear();
  }

  @Roles(Role.SUPER_ADMIN)
  @Post('fetch-anaf-data')
  fetchANAFDataForFinancialReports(): Promise<unknown> {
    return this.organizationCronsService.fetchANAFDataForFinancialReports();
  }

  @Roles(Role.SUPER_ADMIN)
  @Post('complete-reports-1st-june')
  sendEmailToRemindOrganizationProfileUpdate(): Promise<unknown> {
    return this.organizationCronsService.sendEmailToRemindOrganizationProfileUpdate();
  }

  @Roles(Role.SUPER_ADMIN)
  @Post('complete-reports-1st-june-to-30th-june')
  sendReminderForOrganizationProfileUpdate(): Promise<unknown> {
    return this.organizationCronsService.sendReminderForOrganizationProfileUpdate();
  }
}
