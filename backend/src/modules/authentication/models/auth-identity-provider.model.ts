import { AuthIdentityProviderEntity } from '../entities/auth-identity-provider.entity';
import { AuthProvider } from '../enums/auth.enums';
import { AuthIdentityTransformer } from './auth-identity.model';

export interface IAuthIdentityProviderModel {
  id: string;
  identityId: string;
  provider: AuthProvider;
  subject: string;
  emailAtLink: string;
  createdOn: Date;
}

export type CreateAuthIdentityProviderOptions = Pick<
  IAuthIdentityProviderModel,
  'identityId' | 'provider' | 'subject'
> &
  Partial<Pick<IAuthIdentityProviderModel, 'emailAtLink'>>;

export type FindAuthIdentityProviderOptions = Pick<
  IAuthIdentityProviderModel,
  'provider' | 'subject'
>;

export class AuthIdentityProviderTransformer {
  static fromEntity(
    entity: AuthIdentityProviderEntity,
  ): IAuthIdentityProviderModel {
    if (!entity) return null;
    return {
      id: entity.id,
      identityId: entity.identityId,
      provider: entity.provider,
      subject: entity.subject,
      emailAtLink: entity.emailAtLink,
      createdOn: entity.createdOn,
    };
  }

  static toEntity(
    model: CreateAuthIdentityProviderOptions,
  ): AuthIdentityProviderEntity {
    const entity = new AuthIdentityProviderEntity();
    entity.identityId = model.identityId;
    entity.provider = model.provider;
    entity.subject = model.subject;
    entity.emailAtLink = AuthIdentityTransformer.normalizeEmail(
      model.emailAtLink,
    );
    return entity;
  }
}
