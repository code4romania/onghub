import { BadRequestException, Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import {
  ERROR_CODES,
  HTTP_ERRORS_MESSAGES,
} from '../constants/errors.constants';
import { UpdateOrganizationLegalDto } from '../dto/update-organization-legal.dto';
import { OrganizationLegalRepository } from '../repositories';
import { ContactService } from './contact.service';
import { validatePhone } from 'src/common/helpers/validate-phone';

@Injectable()
export class OrganizationLegalService {
  constructor(
    private readonly organizationLegalRepostory: OrganizationLegalRepository,
    private readonly contactService: ContactService,
  ) {}

  public async update(
    id: number,
    updateOrganizationLegalDto: UpdateOrganizationLegalDto,
  ) {
    const { directorsDeleted, ...organizationLegalData } =
      updateOrganizationLegalDto;

    if (updateOrganizationLegalDto?.directors?.length < 3) {
      throw new BadRequestException({
        message: HTTP_ERRORS_MESSAGES.MINIMUM_DIRECTORS,
        errorCode: ERROR_CODES.ORG009,
      });
    }

    if (directorsDeleted?.length > 0) {
      await this.contactService.delete({ id: In(directorsDeleted) });
    }
    
    if (organizationLegalData.legalReprezentative) {
      if (organizationLegalData.legalReprezentative.phone) {
        organizationLegalData.legalReprezentative.phone = validatePhone(organizationLegalData.legalReprezentative.phone);
      }
    }
    organizationLegalData?.directors?.map((director) => {
      if (director.phone) {
        director.phone = validatePhone(director.phone);
      }
    })

    await this.organizationLegalRepostory.save({
      id,
      ...organizationLegalData,
    });

    return this.organizationLegalRepostory.get({
      where: { id },
      relations: ['directors', 'legalReprezentative'],
    });
  }
}
