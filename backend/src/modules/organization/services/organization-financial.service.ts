import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateOrganizationFinancialDto } from '../dto/update-organization-financial.dto';
import { OrganizationFinancialRepository } from '../repositories';
import {
  HTTP_ERRORS_MESSAGES,
  ERROR_CODES,
} from '../constants/errors.constants';
import { CompletionStatus } from '../enums/organization-financial-completion.enum';

@Injectable()
export class OrganizationFinancialService {
  constructor(
    private readonly organizationFinancialRepository: OrganizationFinancialRepository,
  ) {}

  public async update(
    updateOrganizationFinancialDto: UpdateOrganizationFinancialDto,
  ) {
    const organizationFinancial =
      await this.organizationFinancialRepository.get({
        where: { id: updateOrganizationFinancialDto.id },
      });

    const totals = Object.values(updateOrganizationFinancialDto.data).reduce(
      (prev: number, current: number) => (prev += +current || 0),
      0,
    );

    if (!organizationFinancial) {
      throw new NotFoundException({
        message: HTTP_ERRORS_MESSAGES.ANAF_ERROR,
        errorCode: ERROR_CODES.ANAF001,
      });
    }

    return this.organizationFinancialRepository.save({
      ...organizationFinancial,
      data: updateOrganizationFinancialDto.data,
      status:
        totals === organizationFinancial.total
          ? CompletionStatus.COMPLETED
          : CompletionStatus.NOT_COMPLETED,
    });
  }
}
