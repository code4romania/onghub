import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/modules/user/enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(protected reflector: Reflector) {}

  /**
   * Using the @Roles decorator will check if the current user matches one of the specified roles
   * e.g. @Roles(Role.Admin) - only Admins can call the endpoint
   * @param context
   */
  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!allowedRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (allowedRoles.includes(user?.role)) {
      return true;
    }

    return false;
  }
}
