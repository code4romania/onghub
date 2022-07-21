import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { AdminUserController } from './admin-user.controller';
import { AuthenticationModule } from '../authentication/auth.module';
import { CognitoUserService } from './services/cognito.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthenticationModule],
  controllers: [UserController, AdminUserController],
  providers: [UserRepository, UserService, CognitoUserService],
})
export class UserModule {}
