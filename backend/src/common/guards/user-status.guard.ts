import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { USER_ERRORS } from 'src/modules/user/constants/user-error.constants';
import { User } from 'src/modules/user/entities/user.entity';
import { UserStatus } from 'src/modules/user/enums/user-status.enum';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { ALLOWED_STATUSES } from '../decorators/user-status.decorator';

@Injectable()
export class UserStatusGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Skip if it's already public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // Extract the user from the request
    const req = context.switchToHttp().getRequest();
    const user: User = req.user;

    if (!user) {
      throw new UnauthorizedException(USER_ERRORS.GET);
    }

    // Some requests may be decorated to allow users with other statuses than ACTIVE to access the resource (e.g. GET /user)
    const allowedStatuses = this.reflector.get<string[]>(
      ALLOWED_STATUSES,
      context.getHandler(),
    );

    if (allowedStatuses?.includes(req.user.status)) {
      return true;
    }

    if (user.status === UserStatus.RESTRICTED) {
      throw new ForbiddenException(USER_ERRORS.RESTRICTED);
    } else {
      return true;
    }
  }
}
