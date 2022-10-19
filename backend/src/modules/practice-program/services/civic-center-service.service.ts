import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { compareAsc } from 'date-fns';
import { NomenclaturesService } from 'src/shared/services';
import { In } from 'typeorm';
import { CIVIC_CENTER_SERVICE_ERRORS } from '../constants/errors.constants';
import { CivicCenterServiceFilterDto } from '../dto/civic-center-service-filter.dto';
import { CreateCivicCenterServiceDto } from '../dto/create-civic-center-service.dto';
import { UpdateCivicCenterServiceDto } from '../dto/update-civic-center-service.dto';
import { CivicCenterService } from '../entities/civic-center-service.entity';
import { CivicCenterServiceRepository } from '../repositories/civic-center-service.repository';

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

      // 3. check if service startDate is after endDate
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

      // 4. check onlineAccessLink and onlineAccessDescription are filled if hasOnlineAccess is true
      if (
        civicCenterServicePayload.hasOnlineAccess &&
        !(onlineAccessLink && onlineAccessDescription)
      ) {
        throw new BadRequestException(
          CIVIC_CENTER_SERVICE_ERRORS.ONLINE_ACCESS,
        );
      }

      // 5. check emailAccess, phoneAccess and emailPhoneAccessDescription are filled if hasEmailPhoneAccess is true
      if (
        civicCenterServicePayload.hasEmailPhoneAccess &&
        !(emailAccess && phoneAccess && emailPhoneAccessDescription)
      ) {
        throw new BadRequestException(
          CIVIC_CENTER_SERVICE_ERRORS.EMAIL_PHONE_ACCESS,
        );
      }

      // 6. check physicalAccessAddress and physicalAccessDescription are filled if hasPhysicalAccess is true
      if (
        civicCenterServicePayload.hasPhysicalAccess &&
        !(physicalAccessAddress && physicalAccessDescription)
      ) {
        throw new BadRequestException(
          CIVIC_CENTER_SERVICE_ERRORS.PHYSICAL_ACCESS,
        );
      }

      // 7. create new civic center service
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
        civicCenterServicePayload.startDate || civicService.endDate;
      const endDate = civicCenterServicePayload.endDate || civicService.endDate;
      if (endDate && compareAsc(startDate, endDate) > 0) {
        throw new BadRequestException(
          CIVIC_CENTER_SERVICE_ERRORS.START_DATE_AFTER_END_DATE,
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

      // 8. update service
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
}
