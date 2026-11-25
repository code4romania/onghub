import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { OwnAuthModule } from './own-auth.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    OwnAuthModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy],
  exports: [OwnAuthModule],
})
export class AuthenticationModule {}
