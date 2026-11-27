import { AuthTokenEntity } from '../entities/auth-token.entity';
import { AuthTokenForm, AuthTokenType } from '../enums/auth.enums';
import {
  AuthIdentityTransformer,
  IAuthIdentityModel,
} from './auth-identity.model';

export interface IAuthTokenModel {
  id: string;
  identityId: string;
  identity?: IAuthIdentityModel;
  type: AuthTokenType;
  form: AuthTokenForm;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date;
  replacedAt: Date;
  attempts: number;
  sentTo: string;
  sentById: number;
  createdOn: Date;
}

export type CreateAuthTokenOptions = Pick<
  IAuthTokenModel,
  'identityId' | 'type' | 'form' | 'tokenHash' | 'expiresAt'
> &
  Partial<Pick<IAuthTokenModel, 'sentTo' | 'sentById'>>;

export type FindAuthTokenOptions =
  | Pick<IAuthTokenModel, 'id'>
  | Pick<IAuthTokenModel, 'tokenHash'>;

export class AuthTokenTransformer {
  static fromEntity(entity: AuthTokenEntity): IAuthTokenModel {
    if (!entity) return null;
    return {
      id: entity.id,
      identityId: entity.identityId,
      identity: AuthIdentityTransformer.fromEntity(entity.identity),
      type: entity.type,
      form: entity.form,
      tokenHash: entity.tokenHash,
      expiresAt: entity.expiresAt,
      usedAt: entity.usedAt,
      replacedAt: entity.replacedAt,
      attempts: entity.attempts,
      sentTo: entity.sentTo,
      sentById: entity.sentById,
      createdOn: entity.createdOn,
    };
  }

  static toEntity(model: CreateAuthTokenOptions): AuthTokenEntity {
    const entity = new AuthTokenEntity();
    entity.identityId = model.identityId;
    entity.type = model.type;
    entity.form = model.form;
    entity.tokenHash = model.tokenHash;
    entity.expiresAt = model.expiresAt;
    entity.sentTo = model.sentTo;
    entity.sentById = model.sentById;
    return entity;
  }
}
