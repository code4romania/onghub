import { AuthIdentityEntity } from '../entities/auth-identity.entity';

export interface IAuthIdentityModel {
  id: string;
  userId: number;
  emailVerifiedAt: Date;
  lastLoginAt: Date;
  legacyCognitoUsername: string;
  createdOn: Date;
  updatedOn: Date;
}

export type CreateAuthIdentityOptions = Pick<IAuthIdentityModel, 'userId'> &
  Partial<
    Pick<IAuthIdentityModel, 'emailVerifiedAt' | 'legacyCognitoUsername'>
  >;

export type UpdateAuthIdentityOptions = Partial<
  Pick<IAuthIdentityModel, 'emailVerifiedAt' | 'lastLoginAt'>
>;

/** created is false when the user already had an identity; it is returned unchanged. */
export type UpsertAuthIdentityResult = {
  identity: IAuthIdentityModel;
  created: boolean;
};

/** What decides whether an identity may hold a session (read live, never cached). */
export interface LoginState {
  identity: IAuthIdentityModel;
  userId: number;
  email: string;
  userStatus: string;
  role: string;
  organizationId: number | null;
  organizationStatus: string | null;
}

export type FindAuthIdentityOptions =
  | Pick<IAuthIdentityModel, 'id'>
  | Pick<IAuthIdentityModel, 'userId'>
  /** Through user.email, case-insensitive. */
  | { email: string };

export class AuthIdentityTransformer {
  static normalizeEmail(email: string): string {
    return email?.trim().toLowerCase();
  }

  static fromEntity(entity: AuthIdentityEntity): IAuthIdentityModel {
    if (!entity) return null;
    return {
      id: entity.id,
      userId: entity.userId,
      emailVerifiedAt: entity.emailVerifiedAt,
      lastLoginAt: entity.lastLoginAt,
      legacyCognitoUsername: entity.legacyCognitoUsername,
      createdOn: entity.createdOn,
      updatedOn: entity.updatedOn,
    };
  }

  static toEntity(model: CreateAuthIdentityOptions): AuthIdentityEntity {
    const entity = new AuthIdentityEntity();
    entity.userId = model.userId;
    entity.emailVerifiedAt = model.emailVerifiedAt;
    entity.legacyCognitoUsername = model.legacyCognitoUsername;
    return entity;
  }
}
