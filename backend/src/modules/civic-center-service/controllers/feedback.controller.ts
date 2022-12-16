import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { BaseFilterDto } from 'src/common/base/base-filter.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Pagination } from 'src/common/interfaces/pagination';
import { CivicCenterServiceAccessGuard } from 'src/modules/application/guards/civic-center-service-access.guard';
import { ExtractUser } from 'src/modules/user/decorators/user.decorator';
import { User } from 'src/modules/user/entities/user.entity';
import { Role } from 'src/modules/user/enums/role.enum';
import { CivicCenterFeedback } from '../entities/civic-center-feedback.entity';
import { CivicCenterFeedbackService } from '../services/civic-center-feedback.service';

@Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.EMPLOYEE)
@ApiTooManyRequestsResponse()
@UseGuards(CivicCenterServiceAccessGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
@Controller('civic-center/feedback')
export class FeedbackController {
  constructor(
    private readonly civicCenterFeedbackService: CivicCenterFeedbackService,
  ) {}

  @ApiQuery({ type: () => BaseFilterDto })
  @Get()
  async findAll(
    @ExtractUser() user: User,
    @Query() options: BaseFilterDto,
  ): Promise<Pagination<CivicCenterFeedback>> {
    return this.civicCenterFeedbackService.findManyPaginated(user, options);
  }

  @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<CivicCenterFeedback> {
    return this.civicCenterFeedbackService.findOne(id);
  }

  @ApiParam({ name: 'id', type: Number })
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.civicCenterFeedbackService.remove(id);
  }
}
