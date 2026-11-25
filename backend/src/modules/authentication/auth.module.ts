import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { AuthPersistenceModule } from './auth-persistence.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    AuthPersistenceModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy],
  exports: [AuthPersistenceModule],
})
export class AuthenticationModule {}
