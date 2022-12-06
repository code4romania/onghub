import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { AdminUserController } from './admin-user.controller';
import { CognitoUserService } from './services/cognito.service';
import { OrganizationModule } from '../organization/organization.module';
import { ApplicationModule } from '../application/application.module';
import { UserHistory } from './entities/user-history.entity';
import { UserApplicationService } from './services/user-application.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserHistory]),
    forwardRef(() => OrganizationModule),
    ApplicationModule,
    MulterModule.register({
      dest: './download',
    }),
  ],
  controllers: [ProfileController, AdminUserController],
  providers: [
    UserRepository,
    UserService,
    CognitoUserService,
    UserApplicationService,
  ],
  exports: [UserService, UserApplicationService],
})
export class UserModule {}
