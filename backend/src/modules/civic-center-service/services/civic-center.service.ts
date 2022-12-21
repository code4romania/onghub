import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compareAsc } from 'date-fns';
import { NomenclaturesService } from 'src/shared/services';
import { In } from 'typeorm';
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
    // 1. Get location
    const location = await this.nomenclatureService.getCities({
      where: { id: createCivicCenterServiceDto.locationId },
    });

    // 2. Get domains
    const domains = await this.nomenclatureService.getDomains({
      where: {
        id: In(createCivicCenterServiceDto.domains),
      },
    });

    // 3. Check if undetermined flag and end date have correct values
    if (
      createCivicCenterServiceDto.endDate &&
      createCivicCenterServiceDto.isPeriodNotDetermined
    ) {
      createCivicCenterServiceDto.endDate = null;
    }

    // 4. Validate received data
    await this.validateData(createCivicCenterServiceDto);

    // 5. Create new civic center service
    return this.civicCenterServiceRepository.save({
      ...createCivicCenterServiceDto,
      location: location[0],
      domains,
    });
  }

  public async updateServicetatus(
    id: number,
    active: boolean,
    isSuperAdmin: boolean,
    organizationId?: number,
  ): Promise<CivicCenterService> {
    if (!organizationId && !isSuperAdmin) {
      // calling api without organizationId without super-admin persmission throw error
      throw new UnauthorizedException();
    }

    try {
      const where = organizationId
        ? {
            id,
            organizationId,
          }
        : { id };

      const service = await this.civicCenterServiceRepository.get({
        where,
      });

      if (!service) {
        throw new BadRequestException(CIVIC_CENTER_SERVICE_ERRORS.NOT_FOUND);
      }

      return this.civicCenterServiceRepository.save({
        ...service,
        active,
      });
    } catch (error) {
      this.logger.error({
        error: { error },
        ...CIVIC_CENTER_SERVICE_ERRORS.ENABLE_DISABLE,
      });

      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new BadRequestException({
          error: { error },
          ...CIVIC_CENTER_SERVICE_ERRORS.ENABLE_DISABLE,
        });
      }
    }
  }

  public async update(
    id: number,
    updateCivicCenterServiceDto: UpdateCivicCenterServiceDto,
  ): Promise<CivicCenterService> {
    // 1. Get service and if it exists
    const civicService = await this.civicCenterServiceRepository.get({
      where: { id },
    });
    if (!civicService) {
      throw new BadRequestException(CIVIC_CENTER_SERVICE_ERRORS.NOT_FOUND);
    }

    // 2. Get location
    let location = null;
    if (updateCivicCenterServiceDto.locationId) {
      location = await this.nomenclatureService.getCities({
        where: { id: updateCivicCenterServiceDto.locationId },
      });
    }

    // 3. Get domains
    let domains = [];
    if (updateCivicCenterServiceDto.domains?.length > 0) {
      domains = await this.nomenclatureService.getDomains({
        where: {
          id: In(updateCivicCenterServiceDto.domains),
        },
      });
    }

    // 4. Validate received data
    await this.validateData(updateCivicCenterServiceDto);

    // 5. Update service
    return this.civicCenterServiceRepository.save({
      ...civicService,
      ...updateCivicCenterServiceDto,
      location: location || civicService.location,
      domains,
    });
  }

  public async findWithOrganization(
    id: number,
  ): Promise<
    CivicCenterService & { organizationId: number; organizationName: string }
  > {
    const service = await this.civicCenterServiceRepository.get({
      where: { id },
      relations: [
        'location',
        'domains',
        'organization',
        'organization.organizationGeneral',
      ],
    });

    if (!service) {
      throw new NotFoundException(CIVIC_CENTER_SERVICE_ERRORS.NOT_FOUND);
    }

    const { organization, ...civicCenterResponse } = service;

    return {
      ...civicCenterResponse,
      organizationId: organization.id,
      organizationName: organization.organizationGeneral.name,
    };
  }

  public async findAll(organizationId: number): Promise<CivicCenterService[]> {
    return this.civicCenterServiceRepository.getMany({
      where: { organizationId },
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
        shortDescription: true,
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
        ageCategories: ageCategories ? In(ageCategories) : null,
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

  public async find(
    id: number,
    organizationId?: number,
  ): Promise<CivicCenterService> {
    // for admin and employee check organizationId as search criteria
    const where = {
      id,
      ...(organizationId ? { organizationId } : {}),
    };

    const practiceProgram = await this.civicCenterServiceRepository.get({
      where,
      relations: ['location', 'domains'],
    });

    if (!practiceProgram) {
      throw new BadRequestException(CIVIC_CENTER_SERVICE_ERRORS.NOT_FOUND);
    }

    return practiceProgram;
  }

  public async delete(
    id: number,
    isSuperAdmin: boolean,
    organizationId?: number,
  ): Promise<void> {
    if (!organizationId && !isSuperAdmin) {
      // calling api without organizationId without super-admin persmission throw error
      throw new UnauthorizedException();
    }

    try {
      const where = organizationId ? { id, organizationId } : { id };
      await this.civicCenterServiceRepository.remove({ where });
    } catch (error) {
      throw new BadRequestException(CIVIC_CENTER_SERVICE_ERRORS.DELETE);
    }
  }

  public async countActive(): Promise<number> {
    return this.civicCenterServiceRepository.count({ where: { active: true } });
  }

  private async validateData(data: UpdateCivicCenterServiceDto): Promise<void> {
    try {
      // 1. Check if service startDate is after endDate
      if (data.endDate && compareAsc(data.startDate, data.endDate) > 0) {
        throw new BadRequestException(
          CIVIC_CENTER_SERVICE_ERRORS.START_DATE_AFTER_END_DATE,
        );
      }

      // 2. check at least one service access has been provided
      if (
        !(
          data.hasOnlineAccess ||
          data.hasEmailPhoneAccess ||
          data.hasPhysicalAccess
        )
      ) {
        throw new BadRequestException(
          CIVIC_CENTER_SERVICE_ERRORS.SERVICE_ACCESS,
        );
      }

      // 3. check onlineAccessLink is filled if hasOnlineAccess is true
      if (data.hasOnlineAccess && !data.onlineAccessLink) {
        throw new BadRequestException(
          CIVIC_CENTER_SERVICE_ERRORS.ONLINE_ACCESS,
        );
      }

      // 4. check emailAccess and phoneAccess are filled if hasEmailPhoneAccess is true
      if (data.hasEmailPhoneAccess && !(data.emailAccess && data.phoneAccess)) {
        throw new BadRequestException(
          CIVIC_CENTER_SERVICE_ERRORS.EMAIL_PHONE_ACCESS,
        );
      }

      // 5. check physicalAccessAddress is filled if hasPhysicalAccess is true
      if (data.hasPhysicalAccess && !data.physicalAccessAddress) {
        throw new BadRequestException(
          CIVIC_CENTER_SERVICE_ERRORS.PHYSICAL_ACCESS,
        );
      }
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
}
