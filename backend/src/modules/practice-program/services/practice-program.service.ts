import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compareAsc, format } from 'date-fns';
import { DATE_CONSTANTS } from 'src/common/constants/date.constants';
import { OrderDirection } from 'src/common/enums/order-direction.enum';
import { flattenPullingTypeEntity } from 'src/common/helpers/flatten-pulling-type.helper';
import { Pagination } from 'src/common/interfaces/pagination';
import { ApplicationPullingType } from 'src/modules/application/enums/application-pulling-type.enum';
import { ApplicationStatus } from 'src/modules/application/enums/application-status.enum';
import { OngApplicationStatus } from 'src/modules/application/enums/ong-application-status.enum';
import { OngApplicationService } from 'src/modules/application/services/ong-application.service';
import { OrganizationStatus } from 'src/modules/organization/enums/organization-status.enum';
import { Skill } from 'src/shared/entities';
import { NomenclaturesService } from 'src/shared/services';
import { S3FileManagerService } from 'src/shared/services/s3-file-manager.service';
import { In, Raw } from 'typeorm';
import { PRACTICE_PROGRAMS_ERRORS } from '../constants/errors.constants';
import { WorkingHoursParser } from '../constants/parsers.constants';
import { PRACTICE_PROGRAM_FILTER_CONFIG } from '../constants/practice-program-filter.config';
import { CreatePracticeProgramDto } from '../dto/create-practice-program.dto';
import { PracticeProgramFilterDto } from '../dto/practice-program-filter.dto';
import { UpdatePracticeProgramDto } from '../dto/update-practice-program.dto';
import { PracticeProgram } from '../entities/practice-program.entity';
import { PracticeProgramFlat } from '../interfaces/PracticeProgramsFlat';
import { PracticeProgramRepository } from '../repositories/practice-program.repository';

@Injectable()
export class PracticeProgramService {
  private readonly logger = new Logger(PracticeProgramService.name);
  constructor(
    private readonly ongApplicationService: OngApplicationService,
    private readonly practiceProgramRepository: PracticeProgramRepository,
    private readonly nomenclatureService: NomenclaturesService,
    private readonly fileManagerService: S3FileManagerService,
  ) {}

  public async create(
    createPracticeProgramDto: CreatePracticeProgramDto,
  ): Promise<PracticeProgram> {
    try {
      const {
        locationId,
        domains: domainsIds,
        faculties: facultiesIds,
        skills: submitedSkills,
        ...practiceProgramPayload
      } = createPracticeProgramDto;

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

      // 3. get faculties if any selected
      let faculties = [];
      if (facultiesIds?.length > 0) {
        faculties = await this.nomenclatureService.getFaculties({
          where: {
            id: In(facultiesIds),
          },
        });
      }

      // 4. get skills if any selected
      let skills = [];
      if (submitedSkills?.length > 0) {
        skills = await this.saveAndGetSkills(submitedSkills);
      }

      // 5. check if undetermined flag and end date have correct values
      if (
        practiceProgramPayload.endDate &&
        practiceProgramPayload.isPeriodNotDetermined
      ) {
        practiceProgramPayload.endDate === null;
      }

      // 6. check if practice program startDate is after endDate
      if (
        practiceProgramPayload.endDate &&
        compareAsc(
          practiceProgramPayload.startDate,
          practiceProgramPayload.endDate,
        ) > 0
      ) {
        throw new BadRequestException(
          PRACTICE_PROGRAMS_ERRORS.START_DATE_AFTER_END_DATE,
        );
      }

      // 7. check if min working hours are higher than maxWorkingHours
      if (
        practiceProgramPayload.minWorkingHours >
        practiceProgramPayload.maxWorkingHours
      ) {
        throw new BadRequestException(
          PRACTICE_PROGRAMS_ERRORS.MIN_MAX_WORKING_HOURS,
        );
      }

      // 8. create new practice program
      return this.practiceProgramRepository.save({
        ...practiceProgramPayload,
        location: location[0],
        domains,
        faculties,
        skills,
      });
    } catch (error) {
      this.logger.error({
        error: { error },
        ...PRACTICE_PROGRAMS_ERRORS.CREATE,
      });

      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new BadRequestException({
          error: { error },
          ...PRACTICE_PROGRAMS_ERRORS.CREATE,
        });
      }
    }
  }

  public async update(
    id: number,
    updatePracticeProgramDto: UpdatePracticeProgramDto,
  ): Promise<PracticeProgram> {
    try {
      // add filter for organizationId if comes through request
      const { organizationId, ...updatePracticeProgramDtoPayload } =
        updatePracticeProgramDto;
      const where = organizationId ? { id, organizationId } : { id };

      // 1. get practice program
      const practiceProgram = await this.practiceProgramRepository.get({
        where,
      });

      if (!practiceProgram) {
        throw new BadRequestException(PRACTICE_PROGRAMS_ERRORS.NOT_FOUND);
      }

      const {
        locationId,
        domains: domainsIds,
        faculties: facultiesIds,
        skills: submitedSkills,
        ...practiceProgramPayload
      } = updatePracticeProgramDtoPayload;

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

      // 4. get faculties if any selected
      let faculties = [];
      if (facultiesIds?.length > 0) {
        faculties = await this.nomenclatureService.getFaculties({
          where: {
            id: In(facultiesIds),
          },
        });
      }

      // 5. get skills if any selected
      let skills = [];
      if (submitedSkills?.length > 0) {
        skills = await this.saveAndGetSkills(submitedSkills);
      }

      // 6. check if practice program startDate is after endDate
      const startDate =
        practiceProgramPayload.startDate || practiceProgram.endDate;
      const endDate = practiceProgramPayload.endDate || practiceProgram.endDate;

      if (endDate && compareAsc(startDate, endDate) > 0) {
        throw new BadRequestException(
          PRACTICE_PROGRAMS_ERRORS.START_DATE_AFTER_END_DATE,
        );
      }

      // 7. check if min working hours are higher than maxWorkingHours
      const minWorkingHours =
        practiceProgramPayload.minWorkingHours ||
        practiceProgram.minWorkingHours;

      const maxWorkingHours =
        practiceProgramPayload.maxWorkingHours ||
        practiceProgram.maxWorkingHours;

      if (maxWorkingHours && minWorkingHours > maxWorkingHours) {
        throw new BadRequestException(
          PRACTICE_PROGRAMS_ERRORS.MIN_MAX_WORKING_HOURS,
        );
      }

      /**  
       * 8. set correct end date value
          isPeriodUndetermined => true -> endDate = null,
          isPeriodUndetermined => false
            payload contains endDate -> set endDate from payload
            payload doesn't contain endDate -> keep endDate from database
      */
      const finalEndDate = practiceProgramPayload.isPeriodNotDetermined
        ? null
        : practiceProgramPayload.endDate || practiceProgram.endDate;

      // 9. update practice program
      return this.practiceProgramRepository.save({
        ...practiceProgram,
        ...practiceProgramPayload,
        location: location?.length > 0 ? location[0] : practiceProgram.location,
        endDate: finalEndDate,
        domains,
        faculties,
        skills,
      });
    } catch (error) {
      this.logger.error({
        error: JSON.stringify(error),
        ...PRACTICE_PROGRAMS_ERRORS.UPDATE,
      });

      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new BadRequestException({
          error: { error },
          ...PRACTICE_PROGRAMS_ERRORS.UPDATE,
        });
      }
    }
  }

  public async updatePracticeProgramStatus(
    id: number,
    active: boolean,
    isSuperAdmin: boolean,
    organizationId?: number,
  ): Promise<PracticeProgram> {
    if (!isSuperAdmin && !organizationId) {
      throw new UnauthorizedException();
    }

    try {
      const where = organizationId
        ? {
            id,
            organizationId,
          }
        : { id };

      const practiceProgram = await this.practiceProgramRepository.get({
        where,
      });

      if (!practiceProgram) {
        throw new BadRequestException(PRACTICE_PROGRAMS_ERRORS.NOT_FOUND);
      }

      return this.practiceProgramRepository.save({
        ...practiceProgram,
        active,
      });
    } catch (error) {
      this.logger.error({
        error: { error },
        ...PRACTICE_PROGRAMS_ERRORS.ENABLE_DISABLE,
      });

      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new BadRequestException({
          error: { error },
          ...PRACTICE_PROGRAMS_ERRORS.ENABLE_DISABLE,
        });
      }
    }
  }

  public async findAll(organizationId: number): Promise<PracticeProgram[]> {
    const practicePrograms = await this.practiceProgramRepository.getMany({
      where: {
        organizationId,
      },
      order: {
        createdOn: OrderDirection.DESC,
      },
      relations: ['location', 'skills', 'domains', 'faculties'],
    });

    return practicePrograms;
  }

  public async countActive(): Promise<number> {
    return this.practiceProgramRepository.count({
      where: { active: true },
    });
  }

  public async searchPracticePrograms(
    practiceProgramFilters: PracticeProgramFilterDto,
  ): Promise<Pagination<PracticeProgramFlat>> {
    try {
      const { faculties, domains, workingHours, ...restOfFilters } =
        practiceProgramFilters;

      // 1. get only active practice programs and map correctly ids for domains and faculties
      let paginationOptions: any = {
        ...restOfFilters,
        active: true,
        organization: {
          status: OrganizationStatus.ACTIVE,
        },
        faculties: faculties?.length > 0 ? { id: In(faculties) } : null,
        domains: domains?.length > 0 ? { id: In(domains) } : null,
        deadline: Raw((alias) => `(${alias} >= :date OR ${alias} IS NULL)`, {
          date: format(new Date(), DATE_CONSTANTS.YYYY_MM_DD),
        }),
      };

      // 2. set correct mappings for working hours
      if (workingHours) {
        paginationOptions = {
          ...paginationOptions,
          ...WorkingHoursParser[workingHours],
        };
      }

      // 3. return all paginated practice programs with organizations
      const practicePrograms =
        await this.practiceProgramRepository.getManyPaginated(
          PRACTICE_PROGRAM_FILTER_CONFIG,
          paginationOptions,
        );

      // 4. flatten the request
      const flattenPrograms =
        flattenPullingTypeEntity<PracticeProgram>(practicePrograms);

      // 5. map the logo to organization
      const items =
        await this.fileManagerService.mapLogoToEntity<PracticeProgramFlat>(
          flattenPrograms.items,
        );

      return {
        ...flattenPrograms,
        items,
      };
    } catch (error) {
      this.logger.error({
        error: { error },
        ...PRACTICE_PROGRAMS_ERRORS.SEARCH,
      });

      throw new InternalServerErrorException({
        error: { error },
        ...PRACTICE_PROGRAMS_ERRORS.SEARCH,
      });
    }
  }

  public async find(
    id: number,
    organizationId?: number,
  ): Promise<PracticeProgram> {
    // for admin and employee check organizationId as search criteria
    const where = organizationId
      ? {
          id,
          organizationId,
        }
      : { id };

    const practiceProgram = await this.practiceProgramRepository.get({
      where: where,
      relations: [
        'location',
        'location.county',
        'skills',
        'domains',
        'faculties',
      ],
    });

    if (!practiceProgram) {
      throw new BadRequestException(PRACTICE_PROGRAMS_ERRORS.NOT_FOUND);
    }

    return practiceProgram;
  }

  public async findWithOrganization(
    id: number,
  ): Promise<
    PracticeProgram & { organizationId: number; organizationName: string }
  > {
    const practiceProgram = await this.practiceProgramRepository.get({
      where: {
        id,
        active: true,
        organization: {
          status: OrganizationStatus.ACTIVE,
        },
      },
      relations: [
        'location',
        'skills',
        'domains',
        'faculties',
        'organization',
        'organization.organizationGeneral',
      ],
    });

    if (!practiceProgram) {
      throw new NotFoundException(PRACTICE_PROGRAMS_ERRORS.NOT_FOUND);
    }

    const { organization, ...practiceProgramResponse } = practiceProgram;

    return {
      ...practiceProgramResponse,
      organizationId: organization.id,
      organizationName: organization.organizationGeneral.name,
    };
  }

  public async delete(
    id: number,
    isSuperAdmin: boolean,
    organizationId?: number,
  ): Promise<void> {
    if (!isSuperAdmin && !organizationId) {
      throw new UnauthorizedException();
    }

    try {
      const where = organizationId ? { id, organizationId } : { id };
      await this.practiceProgramRepository.remove({ where });
    } catch (error) {
      throw new BadRequestException(PRACTICE_PROGRAMS_ERRORS.NOT_FOUND);
    }
  }

  public async findPracticeShortPracticeProgramsByOrganization(
    organizationId: number,
  ): Promise<PracticeProgram[]> {
    // check if this organization has access to practice programs
    const applicationWithPracticePrograms =
      await this.ongApplicationService.findOngApplicationWithOptions({
        where: {
          organizationId,
          application: {
            status: ApplicationStatus.ACTIVE,
            pullingType: ApplicationPullingType.PRACTICE_PROGRAM,
          },
          status: OngApplicationStatus.ACTIVE,
        },
      });

    if (!applicationWithPracticePrograms) {
      throw new NotFoundException(PRACTICE_PROGRAMS_ERRORS.NOT_FOUND);
    }

    return this.practiceProgramRepository.getMany({
      select: {
        id: true,
        title: true,
        location: {
          name: true,
        },
        startDate: true,
        endDate: true,
        minWorkingHours: true,
        maxWorkingHours: true,
        deadline: true,
      },
      relations: ['location'],
      where: {
        organizationId,
        active: true,
        deadline: Raw((alias) => `(${alias} >= :date OR ${alias} IS NULL)`, {
          date: format(new Date(), DATE_CONSTANTS.YYYY_MM_DD),
        }),
      },
    });
  }

  private async saveAndGetSkills(skills: Partial<Skill>[]): Promise<Skill[]> {
    // 1. separate existing skills from new ones
    const allSkills = skills.reduce(
      (
        previousValue: { existing: Skill[]; new: { name: string }[] },
        currentValue: Skill | { name: string },
      ) => {
        const skillDone = { ...previousValue };

        if (currentValue instanceof Skill && currentValue.id) {
          skillDone.existing.push(currentValue as Skill);
        } else {
          skillDone.new.push(currentValue as { name: string });
        }
        return skillDone;
      },
      { existing: [], new: [] },
    );

    // 2. create new skills
    const newSkills = await this.nomenclatureService.createSkills(
      allSkills.new,
    );

    // 3. return all skills
    return [...newSkills, ...allSkills.existing];
  }
}
