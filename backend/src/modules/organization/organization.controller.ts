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
  Query,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiBearerAuth,
  ApiTooManyRequestsResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities';
import { OrganizationService } from './services/organization.service';
import {
  INVESTOR_UPLOAD_SCHEMA,
  PARTNER_UPLOAD_SCHEMA,
  ORGANIZATION_UPLOAD_SCHEMA,
} from './constants/open-api.schema';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '../user/enums/role.enum';
import { OrganizationFilterDto } from './dto/organization-filter.dto';
import { Pagination } from 'src/common/interfaces/pagination';
import { OrganizationView } from './entities/organization.view-entity';

@Roles(Role.SUPER_ADMIN)
@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  // TODO: Add permissions. Only SuperAdmin and Organization Admin (check the Admin is part of the organization is trying to alter)

  @ApiBody({ type: CreateOrganizationDto })
  @Post()
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationService.create(createOrganizationDto);
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Organization> {
    return this.organizationService.findWithRelations(+id);
  }

  @Get('')
  findAll(
    @Query() filters: OrganizationFilterDto,
  ): Promise<Pagination<OrganizationView>> {
    return this.organizationService.findAll({ options: filters });
  }

  @ApiBody({ type: UpdateOrganizationDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(+id, updateOrganizationDto);
  }

  @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  delete(@Param('id') id: string): Promise<number> {
    return this.organizationService.delete(+id);
  }

  // @Public() -- NEEDED FOR CREATE FLOW
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
  @Post(':id/upload')
  upload(
    @Param('id') id: number,
    @UploadedFiles()
    files: {
      logo: Express.Multer.File[];
      organizationStatute: Express.Multer.File[];
    },
  ): Promise<any> {
    return this.organizationService.upload(
      id,
      files.logo,
      files.organizationStatute,
    );
  }

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

  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'partnerId', type: String })
  @Delete(':id/partners/:partnerId')
  deletePartner(
    @Param('id') id: string,
    @Param('partnerId') partnerId: string,
  ) {
    return this.organizationService.deletePartner(+id, +partnerId);
  }

  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'investorId', type: String })
  @Delete(':id/investors/:investorId')
  deleteInvestors(
    @Param('id') id: string,
    @Param('investorId') investorId: string,
  ) {
    return this.organizationService.deleteInvestor(+id, +investorId);
  }
}
