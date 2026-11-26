import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { OwnAuthModule } from './own-auth.module';
import { OwnAuthController } from './own-auth.controller';
import { OwnLoginService } from './services/own-login.service';
import { OwnJwtStrategy } from './strategies/own-jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    OwnAuthModule,
  ],
  controllers: [AuthController, OwnAuthController],
  providers: [OwnLoginService, OwnJwtStrategy],
  exports: [OwnAuthModule],
})
export class AuthenticationModule {}
