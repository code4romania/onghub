import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/modules/user/entities/user.entity';
import { FindManyOptions, FindOptionsOrder, In } from 'typeorm';
import { FEEDBACK_ERRORS } from '../constants/errors.constants';
import { CreateFeedbackDto } from '../dto/create-feedback.dto';
import { Feedback } from '../entities/feedback.entity';
import { FeedbackRepository } from '../repositories/feedback.repository';
import { CivicCenterServiceService } from './civic-center-service.service';
import { FEEDBACK_FILTERS_CONFIG } from '../constants/feedback-filters.config';
import { Pagination } from 'src/common/interfaces/pagination';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { OrderDirection } from 'src/common/enums/order-direction.enum';

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

  public async findMany(
    options: FindManyOptions<Feedback>,
  ): Promise<Feedback[]> {
    return this.feedbackRepository.getMany(options);
  }

  public async findAll(
    user: User,
    options: BaseFilterDto,
  ): Promise<Pagination<Feedback>> {
    const civicCenterServices = await this.civicCenterServiceService.findAll({
      options: { organizationId: user.organizationId },
    });
    const config = FEEDBACK_FILTERS_CONFIG;
    const { limit, page, orderBy, orderDirection } = options;

    // order conditions
    const orderOptions: FindOptionsOrder<any> = {
      [orderBy || config.defaultSortBy]: orderDirection || OrderDirection.ASC,
    };

    // full query
    let query: FindManyOptions<Feedback> = {
      select: config.selectColumns,
      relations: config.relations,
      order: orderOptions,
      take: limit,
      skip: (page - 1) * limit,
    };

    const civicCenterServiceIds = civicCenterServices.map(
      (service) => service.id,
    );

    const response = await this.findMany({
      where: {
        civicCenterServiceId: In(civicCenterServiceIds),
      },
      ...query,
    });

    const totalCount = await this.feedbackRepository.count({
      where: {
        civicCenterServiceId: In(civicCenterServiceIds),
      },
    });

    return {
      items: response,
      meta: {
        itemCount: response.length,
        totalItems: totalCount,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      },
    };
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
