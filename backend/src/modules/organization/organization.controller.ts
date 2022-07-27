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
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities';
import { OrganizationFiles } from './models/organization-files.interface';
import { OrganizationService } from './services/organization.service';

@ApiTooManyRequestsResponse()
@UseInterceptors(ClassSerializerInterceptor)
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
    @Param('id') id: string,
    @UploadedFiles() files: OrganizationFiles,
  ): Promise<any> {
    return this.organizationService.upload(id, files);
  }
}
