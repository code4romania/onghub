import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  AuthConfigService,
  JWT_AUDIENCE,
  JWT_ISSUER,
} from 'src/common/config/auth.config';
import { UserService } from 'src/modules/user/services/user.service';
import { UserStatus } from 'src/modules/user/enums/user-status.enum';
import { OrganizationStatus } from 'src/modules/organization/enums/organization-status.enum';
import { ORGANIZATION_ERRORS } from 'src/modules/organization/constants/errors.constants';
import { USER_ERRORS } from 'src/modules/user/constants/user-error.constants';
import { AuthIdentityFacade } from '../services/auth-identity.facade';
import { AccessTokenPayload } from '../services/session.service';

/**
 * Verifies NGO Hub's own access tokens (RS256, iss ngohub-api, aud ngohub-web):
 * tokens the OIDC provider issues to client apps never pass. Looks the user up
 * on every request and keeps the old strategy's contract: req.user is the User
 * with its organization; 403 for RESTRICTED user or organization. The
 * PENDING → ACTIVE switch moved to the login itself.
 *
 * Not @Injectable: instantiated by the factory in auth.module.ts only when own
 * auth is enabled (otherwise the Cognito JwtStrategy is registered as 'jwt').
 */
export class OwnJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    authConfig: AuthConfigService,
    private readonly userService: UserService,
    private readonly facade: AuthIdentityFacade,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authConfig.publicKey,
      algorithms: ['RS256'],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
  }

  public async validate(payload: AccessTokenPayload) {
    // Explicit guard: TypeORM 0.3.20 ignores undefined/null where-keys.
    if (typeof payload?.sub !== 'string' || !payload.sub) {
      throw new UnauthorizedException(USER_ERRORS.GET);
    }
    const identity = await this.facade.findIdentity({ id: payload.sub });
    if (!identity?.userId) {
      throw new UnauthorizedException(USER_ERRORS.GET);
    }
    const user = await this.userService.findOne({
      where: { id: identity.userId },
      relations: ['organization'],
    });
    if (!user) {
      throw new UnauthorizedException(USER_ERRORS.GET);
    }
    if (user.organization?.status === OrganizationStatus.RESTRICTED) {
      throw new ForbiddenException(ORGANIZATION_ERRORS.RESTRICTED);
    }
    if (user.status === UserStatus.RESTRICTED) {
      throw new ForbiddenException(USER_ERRORS.RESTRICTED);
    }
    return user;
  }
}
