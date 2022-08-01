import {
  Controller,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
  SetMetadata,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { User } from './entities/user.entity';
import { ExtractUser } from './decorators/user.decorator';
import { AllowedStatuses } from 'src/common/decorators/user-status.decorator';
import { UserStatus } from './enums/user-status.enum';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @AllowedStatuses(UserStatus.RESTRICTED)
  profile(@ExtractUser() user: User) {
    return user;
  }

  // @Roles(...[Role.EMPLOYEE, Role.ADMIN])
  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  // @Roles(...[Role.EMPLOYEE, Role.ADMIN])
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Get()
  // findAll(@Query() userFilterDto: UserFilterDto): Promise<Pagination<User>> {
  //   return this.userService.findAll(userFilterDto);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
