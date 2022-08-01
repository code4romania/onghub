import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
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
      throw new ForbiddenException(`User does not exist in request`);
    }
    // Some requests may be decorated to allow users with other statuses than ACTIVE to access the resource (e.g. GET /user)
    const allowedStatuses = this.reflector.get<string[]>(
      ALLOWED_STATUSES,
      context.getHandler(),
    );

    if (allowedStatuses?.includes(req.user.status)) {
      return true;
    }

    if (user.status !== UserStatus.ACTIVE) {
      // TODO: create custom exception to be handled by the FE interceptor and logout the user with the proper message
      throw new ForbiddenException(
        `Cannot access resource because user status is #${user.status.toUpperCase()}`,
      );
    } else {
      return true;
    }
  }
}
