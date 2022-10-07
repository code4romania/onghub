import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, from, Observable, switchMap, tap } from 'rxjs';
import { PublicKeysManager } from '../public-keys-manager.service';

const SimpleHMACAuth = require('simple-hmac-auth');

@Injectable()
export class HMACVerificationInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HMACVerificationInterceptor.name);
  constructor(private readonly publicKeys: PublicKeysManager) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const auth = new SimpleHMACAuth.Server();

    auth.secretForKey = async (apiKey) => this.publicKeys.getSecretKey(apiKey);

    return from(auth.authenticate(request, request.rawBody))
      .pipe(
        tap(({ apiKey, signature }) => {
          this.logger.log(
            `Authentication passed for request with API key "${apiKey}" and signature "${signature}".`,
          );
        }),
        catchError((err) => {
          this.logger.error(err);
          throw new ForbiddenException(
            err,
            'Could not validate the HMAC signature',
          );
        }),
      )
      .pipe(switchMap(() => next.handle()));
  }
}
