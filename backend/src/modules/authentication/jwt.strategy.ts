import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';
import { CognitoConfig } from 'src/common/config/cognito.config';
import { UserService } from '../user/services/user.service';

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
    console.log(token);
    const user = this.userService.findByCognitoId(token.username);
    return user;
  }
}
