import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from '../dto/create-organization.dto';
import { Organization } from '../entities';
import { OrganizationRepository } from '../repositories/organization.repository';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  create(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    // create the parent entry with default values
    return this.organizationRepository.save({
      organizationGeneral: {
        name: createOrganizationDto.name,
        alias: createOrganizationDto.alias,
        type: createOrganizationDto.type,
        email: createOrganizationDto.email,
        yearCreated: createOrganizationDto.yearCreated,
        cui: createOrganizationDto.cui,
        rafNumber: createOrganizationDto.rafNumber,
        shortDescription: createOrganizationDto.shortDescription || null,
        description: createOrganizationDto.description || null,
        logo: createOrganizationDto.logo,
        website: createOrganizationDto.website || null,
        facebook: createOrganizationDto.facebook || null,
        instagram: createOrganizationDto.instagram || null,
        twitter: createOrganizationDto.twitter || null,
        linkedin: createOrganizationDto.linkedin || null,
        tiktok: createOrganizationDto.tiktok || null,
        donationWebsite: createOrganizationDto.donationWebsite || null,
        donationKeyword: createOrganizationDto.donationKeyword || null,
        donationSMS: createOrganizationDto.donationSMS || null,
        redirectLink: createOrganizationDto.redirectLink || null,
        contact: {
          fullName: createOrganizationDto.contact.fullName,
          email: createOrganizationDto.contact.email,
          phone: createOrganizationDto.contact.phone,
        },
        cityId: createOrganizationDto.cityId,
        countyId: createOrganizationDto.countyId,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} organization`;
  }

  // update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
  //   return `This action updates a #${id} organization`;
  // }
}
