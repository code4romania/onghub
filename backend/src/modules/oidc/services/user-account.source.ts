import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
import { AuthIdentityFacade } from 'src/modules/authentication/services/auth-identity.facade';
import { UserStatus } from 'src/modules/user/enums/user-status.enum';
import { OrganizationStatus } from 'src/modules/organization/enums/organization-status.enum';
import {
  OidcAccount,
  OidcAccountSource,
  OrganizationClaim,
} from '../oidc-account-source.interface';
import { S3FileManagerService } from 'src/shared/services/s3-file-manager.service';
import { FILE_URL_EXPIRATION_TIME } from 'src/shared/constants/file.constants';

@Injectable()
export class UserAccountSource implements OidcAccountSource {
  constructor(
    private readonly userService: UserService,
    private readonly identities: AuthIdentityFacade,
    private readonly files: S3FileManagerService,
  ) {}

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

    // true only after a successful login with link or code (never inherited from Cognito).
    const identity = await this.identities.findIdentity({ userId: user.id });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      emailVerified: !!identity?.emailVerifiedAt,
    };
  }

  /**
   * The organization the user belongs to, from organization_general. Address:
   * the main set (address / city_id / county_id); which set VIC should get is
   * open question 13 and can be switched here.
   */
  async organizationClaim(
    accountId: string,
  ): Promise<OrganizationClaim | undefined> {
    if (!/^[1-9]\d*$/.test(accountId)) return undefined;
    const user = await this.userService.findOne({
      where: { id: Number(accountId) },
      relations: [
        'organization',
        'organization.organizationGeneral',
        'organization.organizationGeneral.city',
        'organization.organizationGeneral.county',
      ],
    });
    const general = user?.organization?.organizationGeneral;
    if (!user?.organization || !general) return undefined;

    const logoUrl = general.logo
      ? await this.files.generatePresignedURL(general.logo)
      : null;
    return {
      id: user.organization.id,
      cui: general.cui,
      name: general.name,
      role: user.role,
      email: general.email,
      phone: general.phone,
      address: general.address || null,
      county: general.county
        ? { id: general.county.id, name: general.county.name }
        : null,
      city: general.city
        ? { id: general.city.id, name: general.city.name }
        : null,
      short_description: general.shortDescription ?? null,
      website: general.website ?? null,
      logo_url: logoUrl,
      logo_url_expires_at: logoUrl
        ? new Date(Date.now() + FILE_URL_EXPIRATION_TIME * 1000).toISOString()
        : null,
    };
  }
}
