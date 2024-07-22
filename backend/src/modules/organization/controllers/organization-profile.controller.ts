import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { FormDataBody } from 'src/common/decorators/form-data-body.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/modules/user/enums/role.enum';
import { ExtractUser } from '../../user/decorators/user.decorator';
import { User } from '../../user/entities/user.entity';
import {
  INVESTOR_UPLOAD_SCHEMA,
  PARTNER_UPLOAD_SCHEMA,
} from '../constants/open-api.schema';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { Organization } from '../entities';
import { OrganizationRequestService } from '../services/organization-request.service';
import { OrganizationService } from '../services/organization.service';

@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('organization-profile')
export class OrganizationProfileController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly organizationRequestService: OrganizationRequestService,
  ) {}

  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @Get()
  findOne(@ExtractUser() user: User): Promise<Organization> {
    return this.organizationService.findWithRelations(user.organizationId);
  }

  @Roles(Role.ADMIN)
  @ApiBody({ type: UpdateOrganizationDto })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'organizationStatute', maxCount: 1 },
      { name: 'nonPoliticalAffiliationFile', maxCount: 1 },
      { name: 'balanceSheetFile', maxCount: 1 },
    ]),
  )
  @Patch()
  update(
    @ExtractUser() user: User,
    @FormDataBody() updateOrganizationDto: UpdateOrganizationDto,
    @UploadedFiles()
    {
      logo,
      organizationStatute,
      nonPoliticalAffiliationFile,
      balanceSheetFile,
    }: {
      logo: Express.Multer.File[];
      organizationStatute: Express.Multer.File[];
      nonPoliticalAffiliationFile: Express.Multer.File[];
      balanceSheetFile: Express.Multer.File[];
    },
  ) {
    return this.organizationService.update(
      user.organizationId,
      updateOrganizationDto,
      logo,
      organizationStatute,
      nonPoliticalAffiliationFile,
      balanceSheetFile,
    );
  }

  @Roles(Role.ADMIN)
  @Post('close')
  requestClose(@ExtractUser() user: User) {
    return this.organizationRequestService.sendRestrictRequest(
      user.organizationId,
    );
  }

  @Roles(Role.ADMIN)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'partners', maxCount: 1 }]))
  @ApiBody({
    schema: PARTNER_UPLOAD_SCHEMA,
  })
  @ApiParam({ name: 'partnerId', type: String })
  @Post('partners/:partnerId')
  uploadPartnerList(
    @ExtractUser() user: User,
    @Param('partnerId') partnerId: string,
    @Body() body: { numberOfPartners: number },
    @UploadedFiles() files: { partners: Express.Multer.File[] },
  ): Promise<any> {
    return this.organizationService.uploadPartners(
      user.organizationId,
      +partnerId,
      +body.numberOfPartners,
      files.partners,
    );
  }

  @Roles(Role.ADMIN)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'investors', maxCount: 1 }]))
  @ApiBody({
    schema: INVESTOR_UPLOAD_SCHEMA,
  })
  @ApiParam({ name: 'investorId', type: String })
  @Post('investors/:investorId')
  uploadInvestorList(
    @ExtractUser() user: User,
    @Param('investorId') investorId: string,
    @Body() body: { numberOfInvestors: number },
    @UploadedFiles() files: { investors: Express.Multer.File[] },
  ): Promise<any> {
    return this.organizationService.uploadInvestors(
      user.organizationId,
      +investorId,
      +body.numberOfInvestors,
      files.investors,
    );
  }

  @Roles(Role.ADMIN)
  @ApiParam({ name: 'partnerId', type: String })
  @Delete('partners/:partnerId')
  deletePartner(
    @ExtractUser() user: User,
    @Param('partnerId') partnerId: string,
  ) {
    return this.organizationService.deletePartner(
      user.organizationId,
      +partnerId,
    );
  }

  @Roles(Role.ADMIN)
  @ApiParam({ name: 'investorId', type: String })
  @Delete('investors/:investorId')
  deleteInvestors(
    @ExtractUser() user: User,
    @Param('investorId') investorId: string,
  ) {
    return this.organizationService.deleteInvestor(
      user.organizationId,
      +investorId,
    );
  }
}
