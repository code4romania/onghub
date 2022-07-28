import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { AdminUserController } from './admin-user.controller';
import { CognitoUserService } from './services/cognito.service';
import { OrganizationModule } from '../organization/organization.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    OrganizationModule,
    LoggerModule.forRoot(),
  ],
  controllers: [UserController, AdminUserController],
  providers: [UserRepository, UserService, CognitoUserService],
  exports: [UserService],
})
export class UserModule {}
