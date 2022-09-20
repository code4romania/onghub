import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseInterceptors,
  ClassSerializerInterceptor,
  UploadedFiles,
  Delete,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiBearerAuth,
  ApiTooManyRequestsResponse,
  ApiParam,
} from '@nestjs/swagger';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { Organization } from '../entities';
import { OrganizationService } from '../services/organization.service';
import {
  INVESTOR_UPLOAD_SCHEMA,
  PARTNER_UPLOAD_SCHEMA,
  ORGANIZATION_UPLOAD_SCHEMA,
} from '../constants/open-api.schema';
import { ExtractUser } from '../../user/decorators/user.decorator';
import { User } from '../../user/entities/user.entity';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '../../user/enums/role.enum';

@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('organization-profile')
export class OrganizationProfileController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Roles(Role.ADMIN, Role.EMPLOYEE)
  @Get()
  findOne(@ExtractUser() user: User): Promise<Organization> {
    return this.organizationService.findWithRelations(user.organizationId);
  }

  @Roles(Role.ADMIN)
  @ApiBody({ type: UpdateOrganizationDto })
  @Patch()
  update(
    @ExtractUser() user: User,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(
      user.organizationId,
      updateOrganizationDto,
    );
  }

  // @Public() -- NEEDED FOR CREATE FLOW
  @Roles(Role.ADMIN)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'organizationStatute', maxCount: 1 },
    ]),
  )
  @ApiBody({
    schema: ORGANIZATION_UPLOAD_SCHEMA,
  })
  @Post('upload')
  upload(
    @ExtractUser() user: User,
    @UploadedFiles()
    files: {
      logo: Express.Multer.File[];
      organizationStatute: Express.Multer.File[];
    },
  ): Promise<any> {
    return this.organizationService.upload(
      user.organizationId,
      files.logo,
      files.organizationStatute,
    );
  }

  @Roles(Role.ADMIN)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'partners', maxCount: 1 }]))
  @ApiBody({
    schema: PARTNER_UPLOAD_SCHEMA,
  })
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
