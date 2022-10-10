import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiQuery,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Pagination } from 'src/common/interfaces/pagination';
import { Role } from '../../user/enums/role.enum';
import {
  INVESTOR_UPLOAD_SCHEMA,
  PARTNER_UPLOAD_SCHEMA,
} from '../constants/open-api.schema';
import { CreateOrganizationRequestDto } from '../dto/create-organization-request.dto';
import { OrganizationFilterDto } from '../dto/organization-filter.dto';
import { OrganizationStatisticsFilterDto } from '../dto/organization-request-filter.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { Organization } from '../entities';
import { OrganizationRequest } from '../entities/organization-request.entity';
import { OrganizationView } from '../entities/organization-view.entity';
import { OrganizationRequestService } from '../services/organization-request.service';
import { OrganizationStatisticsService } from '../services/organization-statistics.service';
import { OrganizationService } from '../services/organization.service';

@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly organizationRequestService: OrganizationRequestService,
    private readonly organizationStatisticsService: OrganizationStatisticsService,
  ) {}

  @Roles(Role.SUPER_ADMIN)
  @Get('')
  findAll(
    @Query() filters: OrganizationFilterDto,
  ): Promise<Pagination<OrganizationView>> {
    return this.organizationService.findAll({ options: filters });
  }

  /**
   * **********************
   * *******STATISTICS*****
   * **********************
   */

  @Roles(Role.SUPER_ADMIN)
  @Get('statistics')
  getSuperAdminStatistics() {
    return this.organizationStatisticsService.getAllOrganizationsStatistics();
  }

  @Roles(Role.ADMIN, Role.EMPLOYEE, Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Get(':id/statistics')
  getAdminStatistics(@Param('id') id: string) {
    return this.organizationStatisticsService.getOrganizationStatistics(+id);
  }

  @Roles(Role.SUPER_ADMIN)
  @Get('request-statistics')
  getSuperAdminOrganizationRequestStatistics(
    @Query() filters: OrganizationStatisticsFilterDto,
  ) {
    return this.organizationStatisticsService.getOrganizationRequestStatistics(
      filters,
    );
  }

  @Roles(Role.SUPER_ADMIN)
  @Get('status-statistics')
  getSuperAdminOrganizationStatusStatistics(
    @Query() filters: OrganizationStatisticsFilterDto,
  ) {
    return this.organizationStatisticsService.getOrganizationStatusStatistics(
      filters,
    );
  }

  @ApiParam({ name: 'id', type: Number })
  @Roles(Role.SUPER_ADMIN)
  @Patch(':id/restrict')
  restrict(@Param('id') id: number) {
    return this.organizationService.restrict(id);
  }

  @ApiParam({ name: 'id', type: Number })
  @Roles(Role.SUPER_ADMIN)
  @Patch(':id/activate')
  activate(@Param('id') id: number) {
    return this.organizationService.activate(id);
  }

  /**
   * *****************************
   * ******* ONG REQUEST *****
   * *****************************
   */
  @Public()
  @ApiBody({ type: CreateOrganizationRequestDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'organizationStatute', maxCount: 1 },
    ]),
  )
  @Post('request')
  create(
    @Body() createRequestDto: CreateOrganizationRequestDto,
    @UploadedFiles()
    {
      logo,
      organizationStatute,
    }: {
      logo: Express.Multer.File[];
      organizationStatute: Express.Multer.File[];
    },
  ): Promise<OrganizationRequest> {
    return this.organizationRequestService.create(
      createRequestDto,
      logo,
      organizationStatute,
    );
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiQuery({ type: () => BaseFilterDto })
  @Get('request')
  async getOrganizationRequests(
    @Query() filters: BaseFilterDto,
  ): Promise<Pagination<OrganizationRequest>> {
    return this.organizationRequestService.findAll(filters);
  }

  @Public()
  @ApiBody({ type: CreateOrganizationRequestDto })
  @Post('request/validate')
  validate(
    @Body() createRequestDto: Partial<CreateOrganizationRequestDto>,
  ): Promise<any[]> {
    return this.organizationRequestService.validate(createRequestDto);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Get('request/:id')
  findOneOrganizationRequest(
    @Param('id') id: string,
  ): Promise<OrganizationRequest> {
    return this.organizationRequestService.findOne(+id);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Patch('request/:id/approve')
  approve(@Param('id') id: number): Promise<OrganizationRequest> {
    return this.organizationRequestService.approve(id);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Patch('request/:id/reject')
  reject(@Param('id') id: number): Promise<OrganizationRequest> {
    return this.organizationRequestService.reject(id);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Organization> {
    return this.organizationService.findWithRelations(+id);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiBody({ type: UpdateOrganizationDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'organizationStatute', maxCount: 1 },
    ]),
  )
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
    @UploadedFiles()
    {
      logo,
      organizationStatute,
    }: {
      logo: Express.Multer.File[];
      organizationStatute: Express.Multer.File[];
    },
  ) {
    return this.organizationService.update(
      +id,
      updateOrganizationDto,
      logo,
      organizationStatute,
    );
  }

  /**
   * *******************
   * *******UPLOADS*****
   * ******************
   */
  @Roles(Role.SUPER_ADMIN)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'partners', maxCount: 1 }]))
  @ApiBody({
    schema: PARTNER_UPLOAD_SCHEMA,
  })
  @Post(':id/partners/:partnerId')
  uploadPartnerList(
    @Param('id') id: string,
    @Param('partnerId') partnerId: string,
    @Body() body: { numberOfPartners: number },
    @UploadedFiles() files: { partners: Express.Multer.File[] },
  ): Promise<any> {
    return this.organizationService.uploadPartners(
      +id,
      +partnerId,
      +body.numberOfPartners,
      files.partners,
    );
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'investors', maxCount: 1 }]))
  @ApiBody({
    schema: INVESTOR_UPLOAD_SCHEMA,
  })
  @Post(':id/investors/:investorId')
  uploadInvestorList(
    @Param('id') id: string,
    @Param('investorId') investorId: string,
    @Body() body: { numberOfInvestors: number },
    @UploadedFiles() files: { investors: Express.Multer.File[] },
  ): Promise<any> {
    return this.organizationService.uploadInvestors(
      +id,
      +investorId,
      +body.numberOfInvestors,
      files.investors,
    );
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'partnerId', type: String })
  @Delete(':id/partners/:partnerId')
  deletePartner(
    @Param('id') id: string,
    @Param('partnerId') partnerId: string,
  ) {
    return this.organizationService.deletePartner(+id, +partnerId);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'investorId', type: String })
  @Delete(':id/investors/:investorId')
  deleteInvestors(
    @Param('id') id: string,
    @Param('investorId') investorId: string,
  ) {
    return this.organizationService.deleteInvestor(+id, +investorId);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Post(':id/new-report-entries')
  createNewReportEntries(@Param('id') id: string) {
    return this.organizationService.createNewReportingEntries(id);
  }
}
