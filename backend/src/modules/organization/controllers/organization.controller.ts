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
import { FormDataBody } from 'src/common/decorators/form-data-body.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Pagination } from 'src/common/interfaces/pagination';
import { ExtractUser } from 'src/modules/user/decorators/user.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import { Role } from '../../user/enums/role.enum';
import {
  INVESTOR_UPLOAD_SCHEMA,
  PARTNER_UPLOAD_SCHEMA,
} from '../constants/open-api.schema';
import { CreateOrganizationRequestDto } from '../dto/create-organization-request.dto';
import { GetOrganizationWithPracticeProgramsFilterDto } from '../dto/get-organization-with-practice-programs-fillter.dto';
import { OrganizationFilterDto } from '../dto/organization-filter.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { ValidateCreateOrganizationRequestDto } from '../dto/validate-create-organization-request.dto';
import { Organization } from '../entities';
import { OrganizationRequest } from '../entities/organization-request.entity';
import { OrganizationView } from '../entities/organization-view.entity';
import { OrganizationFlat } from '../interfaces/OrganizationFlat.interface';
import { OrganizationWithPracticePrograms } from '../interfaces/OrganizationWithPracticePrograms.interface';
import { OrganizationRequestService } from '../services/organization-request.service';
import { OrganizationService } from '../services/organization.service';

@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly organizationRequestService: OrganizationRequestService,
  ) {}

  @Roles(Role.SUPER_ADMIN)
  @ApiQuery({ type: () => OrganizationFilterDto })
  @Get('')
  findAll(
    @Query() filters: OrganizationFilterDto,
  ): Promise<Pagination<OrganizationView>> {
    return this.organizationService.findAll({ options: filters });
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
    @FormDataBody()
    createRequestDto: CreateOrganizationRequestDto,
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
    @Body()
    validateCreateOrganizationRequestDto: ValidateCreateOrganizationRequestDto,
  ): Promise<any[]> {
    return this.organizationRequestService.validate(
      validateCreateOrganizationRequestDto,
    );
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

  /** Practice programs */
  @Public()
  @Get('practice-program')
  findOrganizationsWithPracticePrograms(
    @Query() filters: GetOrganizationWithPracticeProgramsFilterDto,
  ): Promise<Pagination<OrganizationFlat>> {
    return this.organizationService.findAllOrganizationsWithActivePracticePrograms(
      filters,
    );
  }

  @Public()
  @ApiParam({ name: 'id', type: String })
  @Get(':id/practice-program')
  findOrganizationWithPracticePrograms(
    @Param('id') id: number,
  ): Promise<OrganizationWithPracticePrograms> {
    return this.organizationService.findOneOrganizationWithActivePracticePrograms(
      id,
    );
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Organization> {
    return this.organizationService.findWithRelations(+id);
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiBody({ type: UpdateOrganizationDto })
  @ApiParam({ name: 'id', type: String })
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
    @FormDataBody() updateOrganizationDto: UpdateOrganizationDto,
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
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'partnerId', type: String })
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
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'investorId', type: String })
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

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiParam({ name: 'id', type: String })
  @Delete(':id/statute')
  deleteOrganizationStatute(
    @ExtractUser() user: User,
    @Param('id') id: number,
  ) {
    // for admin user.organizationId has precedence
    return this.organizationService.deleteOrganizationStatute(
      user?.organizationId || id,
    );
  }

  @Roles(Role.SUPER_ADMIN)
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    required: false,
    schema: {
      type: 'object',
      required: [],
      properties: {
        forYear: {
          type: 'number',
          format: 'int32',
          minimum: 2020,
        },
      },
    },
  })
  @Post(':id/new-report-entries')
  createNewReportEntries(
    @Param('id') id: string,
    @Body() { forYear }: { forYear: number },
  ) {
    return this.organizationService.createNewReportingEntries(id, forYear);
  }
}
