import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { compareAsc } from 'date-fns';
import { Pagination } from 'src/common/interfaces/pagination';
import { NomenclaturesService } from 'src/shared/services';
import { In } from 'typeorm';
import { PRACTICE_PROGRAMS_ERRORS } from '../constants/errors.constants';
import { WorkingHoursParser } from '../constants/parsers.constants';
import { PRACTICE_PROGRAM_FILTER_CONFIG } from '../constants/practice-program-filter.config';
import { CreatePracticeProgramDto } from '../dto/create-practice-program.dto';
import { PracticeProgramFilterDto } from '../dto/practice-program-filter.dto';
import { UpdatePracticeProgramDto } from '../dto/update-practice-program.dto';
import { PracticeProgram } from '../entities/practice-program.entity';
import { PracticeProgramRepository } from '../repositories/practice-program.repository';

@Injectable()
export class PracticeProgramService {
  private readonly logger = new Logger(PracticeProgramService.name);
  constructor(
    private readonly practiceProgramRepository: PracticeProgramRepository,
    private readonly nomenclatureService: NomenclaturesService,
  ) {}

  public async create(
    CreatePracticeProgramDto: CreatePracticeProgramDto,
  ): Promise<PracticeProgram> {
    try {
      const {
        locationId,
        domains: domainsIds,
        faculties: facultiesIds,
        skills: skillsIds,
        ...practiceProgramPayload
      } = CreatePracticeProgramDto;

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
      if (skillsIds?.length > 0) {
        skills = await this.nomenclatureService.getSkills({
          where: {
            id: In(skillsIds),
          },
        });
      }

      // 5. check if undetermined flad and end date have correct values
      if (
        practiceProgramPayload.endDate &&
        practiceProgramPayload.isPeriodNotDetermined
      ) {
        throw new BadRequestException(
          PRACTICE_PROGRAMS_ERRORS.NOT_DETERMINED_WITH_END_DATE,
        );
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
      // 1. get practice program
      const practiceProgram = await this.practiceProgramRepository.get({
        where: { id },
      });

      if (!practiceProgram) {
        throw new BadRequestException(PRACTICE_PROGRAMS_ERRORS.NOT_FOUND);
      }

      const {
        locationId,
        domains: domainsIds,
        faculties: facultiesIds,
        skills: skillsIds,
        ...practiceProgramPayload
      } = updatePracticeProgramDto;

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
      if (skillsIds?.length > 0) {
        skills = await this.nomenclatureService.getSkills({
          where: {
            id: In(skillsIds),
          },
        });
      }

      // 6. check if undetermined flad and end date have correct values
      if (
        (practiceProgramPayload.endDate || practiceProgram.endDate) &&
        practiceProgramPayload.isPeriodNotDetermined
      ) {
        throw new BadRequestException(
          PRACTICE_PROGRAMS_ERRORS.NOT_DETERMINED_WITH_END_DATE,
        );
      }

      // 7. check if practice program startDate is after endDate
      const startDate =
        practiceProgramPayload.startDate || practiceProgram.endDate;
      const endDate = practiceProgramPayload.endDate || practiceProgram.endDate;

      if (endDate && compareAsc(startDate, endDate) > 0) {
        throw new BadRequestException(
          PRACTICE_PROGRAMS_ERRORS.START_DATE_AFTER_END_DATE,
        );
      }

      // 8. check if min working hours are higher than maxWorkingHours
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
       * 9. set correct end date value
          isPeriodUndetermined => true -> endDate = null,
          isPeriodUndetermined => false
            payload contains endDate -> set endDate from payload
            payload doesn't contain endDate -> keep endDate from database
      */
      const finalEndDate = practiceProgramPayload.isPeriodNotDetermined
        ? null
        : practiceProgramPayload.endDate || practiceProgram.endDate;

      // 9. udpate practice program
      return this.practiceProgramRepository.save({
        ...practiceProgram,
        ...practiceProgramPayload,
        location: location || practiceProgram.location,
        endDate: finalEndDate,
        domains,
        faculties,
        skills,
      });
    } catch (error) {
      this.logger.error({
        error: { error },
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

  public async findAll(): Promise<PracticeProgram[]> {
    return this.practiceProgramRepository.getMany({
      relations: ['location', 'skills', 'domains', 'faculties'],
    });
  }

  public async serachPracticePrograms(
    practiceProgramFilters: PracticeProgramFilterDto,
  ): Promise<Pagination<PracticeProgram>> {
    const { faculties, domains, workingHours, ...restOfFilters } =
      practiceProgramFilters;

    // 1. get onlt active practice programs and map correctly ids for domains and faculties
    let paginationOptions: any = {
      ...restOfFilters,
      active: true,
      faculties: faculties?.length > 0 ? { id: In(faculties) } : null,
      domains: domains?.length > 0 ? { id: In(domains) } : null,
    };

    // 2. set correct mappings for working hours
    if (workingHours) {
      paginationOptions = {
        ...paginationOptions,
        ...WorkingHoursParser[workingHours],
      };
    }

    // 3. return all paginated practice programs with organizations
    return this.practiceProgramRepository.getManyPaginated(
      PRACTICE_PROGRAM_FILTER_CONFIG,
      paginationOptions,
    );
  }

  public async find(id: number): Promise<PracticeProgram> {
    const practiceProgram = await this.practiceProgramRepository.get({
      where: {
        id,
      },
      relations: ['location', 'skills', 'domains', 'faculties'],
    });

    if (!practiceProgram) {
      throw new BadRequestException(PRACTICE_PROGRAMS_ERRORS.NOT_FOUND);
    }

    return practiceProgram;
  }

  public async delete(id: number): Promise<void> {
    try {
      await this.practiceProgramRepository.remove({ where: { id } });
    } catch (error) {
      throw new BadRequestException(PRACTICE_PROGRAMS_ERRORS.NOT_FOUND);
    }
  }
}
