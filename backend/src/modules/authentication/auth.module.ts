import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthConfig } from './auth.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [AuthController],
  providers: [AuthConfig, AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthenticationModule {}
