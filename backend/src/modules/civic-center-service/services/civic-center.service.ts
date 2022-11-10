import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { compareAsc } from 'date-fns';
import { NomenclaturesService } from 'src/shared/services';
import { In } from 'typeorm';
import { CivicCenterServiceFilterDto } from '../dto/civic-center-service-filter.dto';
import { CreateCivicCenterServiceDto } from '../dto/create-civic-center-service.dto';
import { UpdateCivicCenterServiceDto } from '../dto/update-civic-center-service.dto';
import { CivicCenterService } from '../entities/civic-center-service.entity';
import { CivicCenterServiceRepository } from '../repositories/civic-center-service.repository';
import { CIVIC_CENTER_SERVICE_ERRORS } from '../constants/errors.constants';
import { Pagination } from 'src/common/interfaces/pagination';
import { CivicCenterServiceSearchFilterDto } from '../dto/civic-center-service-search-filter.dto';
import { CIVIC_SERVICE_FILTERS_CONFIG } from '../constants/civic-center-filters.config';
import { OrganizationStatus } from 'src/modules/organization/enums/organization-status.enum';

@Injectable()
export class CivicCenterServiceService {
  private readonly logger = new Logger(CivicCenterServiceService.name);
  constructor(
    private readonly civicCenterServiceRepository: CivicCenterServiceRepository,
    private readonly nomenclatureService: NomenclaturesService,
  ) {}

  public async create(
    createCivicCenterServiceDto: CreateCivicCenterServiceDto,
  ): Promise<CivicCenterService> {
    try {
      const {
        locationId,
        domains: domainsIds,
        onlineAccessLink,
        onlineAccessDescription,
        emailAccess,
        phoneAccess,
        emailPhoneAccessDescription,
        physicalAccessAddress,
        physicalAccessDescription,
        ...civicCenterServicePayload
      } = createCivicCenterServiceDto;

      // 1. get location
      const location = await this.nomenclatureService.getCities({
        where: { id: locationId },
      });

      // 2. get domains
      const domains = await this.nomenclatureService.getDomains({
        where: {
          id: In(domainsIds),
        },
      });

      // 3.1. check if undetermined flag and end date have correct values
      if (
        civicCenterServicePayload.endDate &&
        civicCenterServicePayload.isPeriodNotDetermined
      ) {
        civicCenterServicePayload.endDate === null;
      }

      // 3.2 check if service startDate is after endDate
      if (
        civicCenterServicePayload.endDate &&
        compareAsc(
          civicCenterServicePayload.startDate,
          civicCenterServicePayload.endDate,
        ) > 0
      ) {
        throw new BadRequestException(
          CIVIC_CENTER_SERVICE_ERRORS.START_DATE_AFTER_END_DATE,
        );
      }

      // 4. check at least one service access has been provided
      if (
        !(
          civicCenterServicePayload.hasOnlineAccess ||
          civicCenterServicePayload.hasEmailPhoneAccess ||
          civicCenterServicePayload.hasPhysicalAccess
        )
      ) {
        throw new BadRequestException(
          CIVIC_CENTER_SERVICE_ERRORS.SERVICE_ACCESS,
        );
      }

      // 5. check onlineAccessLink and onlineAccessDescription are filled if hasOnlineAccess is true
      if (
        civicCenterServicePayload.hasOnlineAccess &&
        !(onlineAccessLink && onlineAccessDescription)
      ) {
        throw new BadRequestException(
          CIVIC_CENTER_SERVICE_ERRORS.ONLINE_ACCESS,
        );
      }

      // 6. check emailAccess, phoneAccess and emailPhoneAccessDescription are filled if hasEmailPhoneAccess is true
      if (
        civicCenterServicePayload.hasEmailPhoneAccess &&
        !(emailAccess && phoneAccess && emailPhoneAccessDescription)
      ) {
        throw new BadRequestException(
          CIVIC_CENTER_SERVICE_ERRORS.EMAIL_PHONE_ACCESS,
        );
      }

      // 7. check physicalAccessAddress and physicalAccessDescription are filled if hasPhysicalAccess is true
      if (
        civicCenterServicePayload.hasPhysicalAccess &&
        !(physicalAccessAddress && physicalAccessDescription)
      ) {
        throw new BadRequestException(
          CIVIC_CENTER_SERVICE_ERRORS.PHYSICAL_ACCESS,
        );
      }

      // 8. create new civic center service
      return this.civicCenterServiceRepository.save({
        ...civicCenterServicePayload,
        location: location[0],
        domains,
        ...(civicCenterServicePayload.hasOnlineAccess
          ? { onlineAccessLink, onlineAccessDescription }
          : {}),
        ...(civicCenterServicePayload.hasEmailPhoneAccess
          ? { emailAccess, phoneAccess, emailPhoneAccessDescription }
          : {}),
        ...(civicCenterServicePayload.hasPhysicalAccess
          ? { physicalAccessAddress, physicalAccessDescription }
          : {}),
      });
    } catch (error) {
      this.logger.error({
        error: { error },
        ...CIVIC_CENTER_SERVICE_ERRORS.CREATE,
      });
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new BadRequestException({
          error: { error },
          ...CIVIC_CENTER_SERVICE_ERRORS.CREATE,
        });
      }
    }
  }

  public async update(
    id: number,
    updateCivicCenterServiceDto: UpdateCivicCenterServiceDto,
  ): Promise<CivicCenterService> {
    try {
      // 1. get service
      const civicService = await this.civicCenterServiceRepository.get({
        where: { id },
      });
      if (!civicService) {
        throw new BadRequestException(CIVIC_CENTER_SERVICE_ERRORS.NOT_FOUND);
      }

      const {
        locationId,
        domains: domainsIds,
        onlineAccessLink,
        onlineAccessDescription,
        emailAccess,
        phoneAccess,
        emailPhoneAccessDescription,
        physicalAccessAddress,
        physicalAccessDescription,
        ...civicCenterServicePayload
      } = updateCivicCenterServiceDto;

      // 2. get location
      let location = null;
      if (locationId) {
        location = await this.nomenclatureService.getCities({
          where: { id: locationId },
        });
      }

      // 3. get domains
      let domains = [];
      if (domainsIds?.length > 0) {
        domains = await this.nomenclatureService.getDomains({
          where: {
            id: In(domainsIds),
          },
        });
      }

      // 4. check if service startDate is after endDate
      const startDate =
        civicCenterServicePayload.startDate || civicService.startDate;
      const endDate = civicCenterServicePayload.endDate || civicService.endDate;
      if (endDate && compareAsc(startDate, endDate) > 0) {
        throw new BadRequestException(
          CIVIC_CENTER_SERVICE_ERRORS.START_DATE_AFTER_END_DATE,
        );
      }

      // 5. check at least one service access has been provided
      const hasOnlineAccess =
        civicCenterServicePayload.hasOnlineAccess !== undefined
          ? civicCenterServicePayload.hasOnlineAccess
          : civicService.hasOnlineAccess;
      const hasEmailPhoneAccess =
        civicCenterServicePayload.hasEmailPhoneAccess !== undefined
          ? civicCenterServicePayload.hasEmailPhoneAccess
          : civicService.hasEmailPhoneAccess;
      const hasPhysicalAccess =
        civicCenterServicePayload.hasPhysicalAccess !== undefined
          ? civicCenterServicePayload.hasPhysicalAccess
          : civicService.hasPhysicalAccess;

      if (!(hasOnlineAccess || hasEmailPhoneAccess || hasPhysicalAccess)) {
        throw new BadRequestException(
          CIVIC_CENTER_SERVICE_ERRORS.SERVICE_ACCESS,
        );
      }

      // 6. check onlineAccessLink and onlineAccessDescription are filled if hasOnlineAccess is true
      if (
        civicCenterServicePayload.hasOnlineAccess &&
        !(onlineAccessLink && onlineAccessDescription)
      ) {
        throw new BadRequestException(
          CIVIC_CENTER_SERVICE_ERRORS.ONLINE_ACCESS,
        );
      }

      // 7. check emailAccess, phoneAccess and emailPhoneAccessDescription are filled if hasEmailPhoneAccess is true
      if (
        civicCenterServicePayload.hasEmailPhoneAccess &&
        !(emailAccess && phoneAccess && emailPhoneAccessDescription)
      ) {
        throw new BadRequestException(
          CIVIC_CENTER_SERVICE_ERRORS.EMAIL_PHONE_ACCESS,
        );
      }

      // 8. check physicalAccessAddress and physicalAccessDescription are filled if hasPhysicalAccess is true
      if (
        civicCenterServicePayload.hasPhysicalAccess &&
        !(physicalAccessAddress && physicalAccessDescription)
      ) {
        throw new BadRequestException(
          CIVIC_CENTER_SERVICE_ERRORS.PHYSICAL_ACCESS,
        );
      }

      // 9. update service
      return this.civicCenterServiceRepository.save({
        ...civicService,
        ...civicCenterServicePayload,
        location: location || civicService.location,
        endDate,
        domains,
        ...(civicCenterServicePayload.hasOnlineAccess
          ? { onlineAccessLink, onlineAccessDescription }
          : {}),
        ...(civicCenterServicePayload.hasEmailPhoneAccess
          ? { emailAccess, phoneAccess, emailPhoneAccessDescription }
          : {}),
        ...(civicCenterServicePayload.hasPhysicalAccess
          ? { physicalAccessAddress, physicalAccessDescription }
          : {}),
      });
    } catch (error) {
      this.logger.error({
        error: { error },
        ...CIVIC_CENTER_SERVICE_ERRORS.UPDATE,
      });
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new BadRequestException({
          error: { error },
          ...CIVIC_CENTER_SERVICE_ERRORS.UPDATE,
        });
      }
    }
  }

  public async findAll({
    options,
  }: {
    options: CivicCenterServiceFilterDto;
  }): Promise<CivicCenterService[]> {
    return this.civicCenterServiceRepository.getMany({
      where: options,
      relations: ['location', 'domains'],
    });
  }

  public async findPracticeShortServicesByOrganization(
    organizationId: number,
  ): Promise<CivicCenterService[]> {
    return this.civicCenterServiceRepository.getMany({
      select: {
        id: true,
        name: true,
        location: {
          name: true,
        },
        startDate: true,
        endDate: true,
        hasEmailPhoneAccess: true,
        hasOnlineAccess: true,
        hasPhysicalAccess: true,
      },
      relations: ['location'],
      where: { organizationId },
    });
  }

  public async searchCivicCenterServices(
    civicCenterServiceFilterDto: CivicCenterServiceSearchFilterDto,
  ): Promise<Pagination<CivicCenterService>> {
    try {
      const { domains, ageCategories, ...restOfFilters } =
        civicCenterServiceFilterDto;

      // 1. get only active services and map correctly ids for domains and age categories
      let paginationOptions: any = {
        ...restOfFilters,
        active: true,
        organization: {
          status: OrganizationStatus.ACTIVE,
        },
        domains: domains?.length > 0 ? { id: In(domains) } : null,
        ageCategory: ageCategories ? In(ageCategories) : null,
      };

      // 2. return all paginated services
      return this.civicCenterServiceRepository.getManyPaginated(
        CIVIC_SERVICE_FILTERS_CONFIG,
        paginationOptions,
      );
    } catch (error) {
      this.logger.error({
        error: { error },
        ...CIVIC_CENTER_SERVICE_ERRORS.SEARCH,
      });
      throw new InternalServerErrorException({
        error: { error },
        ...CIVIC_CENTER_SERVICE_ERRORS.SEARCH,
      });
    }
  }

  public async find(id: number): Promise<CivicCenterService> {
    const practiceProgram = await this.civicCenterServiceRepository.get({
      where: {
        id,
      },
      relations: ['location', 'domains'],
    });

    if (!practiceProgram) {
      throw new BadRequestException(CIVIC_CENTER_SERVICE_ERRORS.NOT_FOUND);
    }

    return practiceProgram;
  }

  public async delete(id: number): Promise<void> {
    try {
      await this.civicCenterServiceRepository.remove({ where: { id } });
    } catch (error) {
      throw new BadRequestException(CIVIC_CENTER_SERVICE_ERRORS.DELETE);
    }
  }

  public async countActive(): Promise<number> {
    return this.civicCenterServiceRepository.count({ where: { active: true } });
  }
}
