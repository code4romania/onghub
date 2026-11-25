import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
import { UserStatus } from 'src/modules/user/enums/user-status.enum';
import { OrganizationStatus } from 'src/modules/organization/enums/organization-status.enum';
import {
  OidcAccount,
  OidcAccountSource,
} from '../oidc-account-source.interface';

@Injectable()
export class UserAccountSource implements OidcAccountSource {
  constructor(private readonly userService: UserService) {}

  async findActive(accountId: string): Promise<OidcAccount | undefined> {
    // `sub` is user.id as a decimal string. Reject anything else up front:
    // TypeORM 0.3.20 drops undefined/null keys from `where`, which would match any row.
    if (!/^[1-9]\d*$/.test(accountId)) {
      return undefined;
    }

    const user = await this.userService.findOne({
      where: { id: Number(accountId) },
      relations: ['organization'],
    });

    if (
      !user ||
      user.status !== UserStatus.ACTIVE ||
      !user.organization ||
      user.organization.status !== OrganizationStatus.ACTIVE
    ) {
      return undefined;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      // Becomes auth_identity.email_verified_at once own auth (O4-O6) lands.
      emailVerified: false,
    };
  }
}
