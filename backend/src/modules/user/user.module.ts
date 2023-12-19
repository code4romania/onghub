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
import { SharedModule } from 'src/shared/shared.module';
import { UserApplicationsView } from './entities/user-applications-view.entity';
import { UserApplicationsViewRepository } from './repositories/user-applications-view.repository';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([User, UserHistory, UserApplicationsView]),
    forwardRef(() => OrganizationModule),
    ApplicationModule,
  ],
  controllers: [ProfileController, AdminUserController],
  providers: [
    UserRepository,
    UserApplicationsViewRepository,
    UserService,
    CognitoUserService,
    UserApplicationService,
  ],
  exports: [UserService, UserApplicationService],
})
export class UserModule {}
