import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { HTTP_ERRORS_MESSAGES } from '../constants/errors.constants';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { UpdateOrganizationDto } from '../dto/update-organization.dto';
import { Organization } from '../entities';
import { OrganizationRepository } from '../repositories/organization.repository';
import { OrganizationGeneralService } from './organization-general.service';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly organizationGeneralService: OrganizationGeneralService,
  ) {}

  public create(
    createOrganizationDto: CreateOrganizationDto,
  ): Promise<Organization> {
    // create the parent entry with default values
    return this.organizationRepository.save({
      organizationGeneral: {
        ...createOrganizationDto.general,
      },
    });
  }

  public async findOne(id: number): Promise<Organization> {
    const organization = await this.organizationRepository.get({
      where: { id },
      relations: [
        'organizationGeneral',
        'organizationGeneral.city',
        'organizationGeneral.county',
        'organizationGeneral.contact',
      ],
    });

    if (!organization) {
      throw new NotFoundException(HTTP_ERRORS_MESSAGES.ORGANIZATION);
    }

    return organization;
  }

  public async update(
    id: number,
    updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<UpdateResult> {
    const organization = await this.organizationRepository.get({
      where: { id },
    });

    if (!organization) {
      throw new NotFoundException(HTTP_ERRORS_MESSAGES.ORGANIZATION);
    }

    if (updateOrganizationDto.general) {
      return this.organizationGeneralService.update(
        organization.organizationGeneralId,
        updateOrganizationDto.general,
      );
    }

    return null;
  }
}
