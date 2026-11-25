import { RefreshTokenEntity } from '../entities/refresh-token.entity';

export interface IRefreshTokenModel {
  id: string;
  identityId: string;
  tokenHash: string;
  previousHash: string;
  rotatedAt: Date;
  expiresAt: Date;
  revokedAt: Date;
  lastUsedAt: Date;
  userAgent: string;
  ip: string;
  createdOn: Date;
}

export type CreateRefreshTokenOptions = Pick<
  IRefreshTokenModel,
  'identityId' | 'tokenHash' | 'expiresAt'
> &
  Partial<Pick<IRefreshTokenModel, 'userAgent' | 'ip'>>;

export type FindRefreshTokenOptions =
  | Pick<IRefreshTokenModel, 'id'>
  | Pick<IRefreshTokenModel, 'tokenHash'>
  | Pick<IRefreshTokenModel, 'previousHash'>;

export class RefreshTokenTransformer {
  static fromEntity(entity: RefreshTokenEntity): IRefreshTokenModel {
    if (!entity) return null;
    return {
      id: entity.id,
      identityId: entity.identityId,
      tokenHash: entity.tokenHash,
      previousHash: entity.previousHash,
      rotatedAt: entity.rotatedAt,
      expiresAt: entity.expiresAt,
      revokedAt: entity.revokedAt,
      lastUsedAt: entity.lastUsedAt,
      userAgent: entity.userAgent,
      ip: entity.ip,
      createdOn: entity.createdOn,
    };
  }

  static toEntity(model: CreateRefreshTokenOptions): RefreshTokenEntity {
    const entity = new RefreshTokenEntity();
    entity.identityId = model.identityId;
    entity.tokenHash = model.tokenHash;
    entity.expiresAt = model.expiresAt;
    entity.userAgent = model.userAgent;
    entity.ip = model.ip;
    return entity;
  }
}
