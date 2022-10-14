import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { compareAsc } from 'date-fns';
import { NomenclaturesService } from 'src/shared/services';
import { In } from 'typeorm';
import { PRACTICE_PROGRAMS_ERRORS } from '../constants/errors.constants';
import { CreatePracticeProgramDto } from '../dto/create-practice-program.dto';
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
      })[0];

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

      // 5. TODO: check if practice program startDate is after endDate
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

      // 6. check if min working hours are higher than maxWorkingHours
      if (
        practiceProgramPayload.minWorkingHours >
        practiceProgramPayload.maxWorkingHours
      ) {
        throw new BadRequestException(
          PRACTICE_PROGRAMS_ERRORS.MIN_MAX_WORKING_HOURS,
        );
      }

      // 7. create new practice program
      return this.practiceProgramRepository.save({
        ...practiceProgramPayload,
        location,
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
}
