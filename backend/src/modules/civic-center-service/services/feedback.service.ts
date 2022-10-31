import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/modules/user/entities/user.entity';
import { FindManyOptions, In } from 'typeorm';
import { FEEDBACK_ERRORS } from '../constants/errors.constants';
import { CreateFeedbackDto } from '../dto/create-feedback.dto';
import { Feedback } from '../entities/feedback.entity';
import { FeedbackRepository } from '../repositories/feedback.repository';
import { CivicCenterServiceService } from './civic-center-service.service';
import { FEEDBACK_FILTERS_CONFIG } from '../constants/feedback-filters.config';
import { Pagination } from 'src/common/interfaces/pagination';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly feedbackRepository: FeedbackRepository,
    private readonly civicCenterServiceService: CivicCenterServiceService,
  ) {}

  public async create(data: CreateFeedbackDto): Promise<Feedback> {
    try {
      const { name, interactionDate, message, rating, civicCenterServiceId } =
        data;
      return this.feedbackRepository.save({
        name,
        interactionDate,
        message,
        rating,
        civicCenterServiceId,
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

  public async findAll(user: User): Promise<Feedback[]> {
    const civicCenterServices = await this.civicCenterServiceService.findAll({
      options: { organizationId: user.organizationId },
    });
    const config = FEEDBACK_FILTERS_CONFIG;

    // filters (and where)
    const orWhereQuery = [];

    // full query
    let query: FindManyOptions<Feedback> = {
        select: config.selectColumns,
        relations: config.relations,
      };
  
      if (orWhereQuery.length > 0) {
        query = {
          ...query,
          where: orWhereQuery,
        };
      }
  
      const response = await this.findMany({
        where: {}
        ...query,
      });
  
      return response;

    return this.feedbackRepository.getMany({
      where: {
        civicCenterServiceId: In(
          civicCenterServices.map((service) => service.id),
        ),
      },
    });
  }

  public async findOne(id: number): Promise<Feedback> {
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
