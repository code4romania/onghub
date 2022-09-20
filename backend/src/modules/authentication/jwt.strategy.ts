import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';
import { CognitoConfig } from 'src/common/config/cognito.config';
import { UserService } from '../user/services/user.service';
import { OrganizationStatus } from '../organization/enums/organization-status.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${CognitoConfig.authority}/.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //   audience: authConfig.clientId,
      issuer: CognitoConfig.authority,
      algorithms: ['RS256'],
    });
  }

  public async validate(token: { username: string }) {
    const user = await this.userService.findByCognitoId(token.username);

    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.organization.status === OrganizationStatus.RESTRICTED) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
