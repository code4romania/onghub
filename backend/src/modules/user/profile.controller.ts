import {
  Controller,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { User } from './entities/user.entity';
import { ExtractUser } from './decorators/user.decorator';
import { AllowedStatuses } from 'src/common/decorators/user-status.decorator';
import { UserStatus } from './enums/user-status.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('profile')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @AllowedStatuses(UserStatus.RESTRICTED)
  profile(@ExtractUser() user: User) {
    return user;
  }

  @Delete('')
  remove(@ExtractUser() user: User) {
    return this.userService.remove(user);
  }
}
