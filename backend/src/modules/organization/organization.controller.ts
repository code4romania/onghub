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
} from '@nestjs/swagger';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities';
import { OrganizationFiles } from './models/organization-files.interface';
import { OrganizationService } from './services/organization.service';

@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @ApiBody({ type: CreateOrganizationDto })
  @Post()
  create(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationService.create(createOrganizationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Organization> {
    return this.organizationService.findOne(+id);
  }

  @ApiBody({ type: UpdateOrganizationDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ) {
    return this.organizationService.update(+id, updateOrganizationDto);
  }

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'logo', maxCount: 1 },
      { name: 'organizationStatute', maxCount: 1 },
    ]),
  )
  @Post(':id/upload')
  upload(
    @Param('id') id: number,
    @UploadedFiles() files: OrganizationFiles,
  ): Promise<any> {
    return this.organizationService.upload(id, files);
  }

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'partners', maxCount: 1 }]))
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

  @ApiConsumes('multipart/form-data')
  @Delete(':id/partners/:partnerId')
  deletePartner(
    @Param('id') id: string,
    @Param('partnerId') partnerId: string,
  ) {
    return this.organizationService.deletePartner(+id, +partnerId);
  }

  @Delete(':id/investors/:investorId')
  deleteInvestors(
    @Param('id') id: string,
    @Param('investorId') investorId: string,
  ) {
    return this.organizationService.deleteInvestor(+id, +investorId);
  }
}
