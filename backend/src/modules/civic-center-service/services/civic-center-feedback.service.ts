import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/modules/user/entities/user.entity';
import { FindManyOptions } from 'typeorm';
import { FEEDBACK_ERRORS } from '../constants/errors.constants';
import { CreateFeedbackDto } from '../dto/create-feedback.dto';
import { CivicCenterFeedback } from '../entities/civic-center-feedback.entity';
import { CivicCenterFeedbackRepository } from '../repositories/civic-center-feedback.repository';
import { FEEDBACK_FILTERS_CONFIG } from '../constants/feedback-filters.config';
import { Pagination } from 'src/common/interfaces/pagination';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';

@Injectable()
export class CivicCenterFeedbackService {
  constructor(
    private readonly feedbackRepository: CivicCenterFeedbackRepository,
  ) {}

  public async create(
    id: number,
    data: CreateFeedbackDto,
  ): Promise<CivicCenterFeedback> {
    try {
      return this.feedbackRepository.save({
        civicCenterServiceId: id,
        ...data,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new BadRequestException({
          error,
          ...FEEDBACK_ERRORS.CREATE,
        });
      }
    }
  }

  public async findMany(
    options: FindManyOptions<CivicCenterFeedback>,
  ): Promise<CivicCenterFeedback[]> {
    return this.feedbackRepository.getMany(options);
  }

  public async findManyPaginated(
    user: User,
    options: BaseFilterDto,
  ): Promise<Pagination<CivicCenterFeedback>> {
    const paginationOptions: any = {
      civicCenterService: {
        organizationId: user.organizationId,
      },
      ...options,
    };

    return this.feedbackRepository.getManyPaginated(
      FEEDBACK_FILTERS_CONFIG,
      paginationOptions,
    );
  }

  public async findOne(id: number): Promise<CivicCenterFeedback> {
    const feedback = await this.feedbackRepository.get({ where: { id } });

    if (!feedback) {
      throw new NotFoundException(FEEDBACK_ERRORS.NOT_FOUND);
    }

    return feedback;
  }

  public async remove(id: number): Promise<void> {
    try {
      await this.findOne(id);
      await this.feedbackRepository.remove({ where: { id } });
    } catch (error) {
      throw new BadRequestException({
        error,
        ...FEEDBACK_ERRORS.DELETE,
      });
    }
  }
}
