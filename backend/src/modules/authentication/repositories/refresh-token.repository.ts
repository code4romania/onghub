import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { RefreshTokenEntity } from '../entities/refresh-token.entity';
import {
  CreateRefreshTokenOptions,
  IRefreshTokenModel,
  RefreshTokenTransformer,
} from '../models/refresh-token.model';

// Rows are returned in any state; the session service decides what a revoked or expired row means.
@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  public async create(
    options: CreateRefreshTokenOptions,
    manager?: EntityManager,
  ): Promise<IRefreshTokenModel> {
    const entity = await this.repository(manager).save(
      RefreshTokenTransformer.toEntity(options),
    );

    return RefreshTokenTransformer.fromEntity(entity);
  }

  public async findSessionByHash(
    tokenHash: string,
  ): Promise<IRefreshTokenModel> {
    if (!tokenHash) return null;

    const entity = await this.refreshTokenRepository.findOne({
      where: { tokenHash },
    });

    return RefreshTokenTransformer.fromEntity(entity);
  }

  public async findSessionByPreviousHash(
    previousHash: string,
  ): Promise<IRefreshTokenModel> {
    if (!previousHash) return null;

    const entity = await this.refreshTokenRepository.findOne({
      where: { previousHash },
    });

    return RefreshTokenTransformer.fromEntity(entity);
  }

  // Only rotates while the row still holds currentTokenHash, so two requests presenting the same
  // token cannot both rotate it; the loser gets null.
  public async rotate(
    id: string,
    currentTokenHash: string,
    newTokenHash: string,
    expiresAt: Date,
    manager?: EntityManager,
  ): Promise<IRefreshTokenModel> {
    if (!id || !currentTokenHash) return null;

    // previous_hash takes the old token_hash: Postgres reads the old row on the right of SET.
    const result = await this.repository(manager)
      .createQueryBuilder()
      .update()
      .set({
        previousHash: () => '"token_hash"',
        tokenHash: newTokenHash,
        expiresAt,
        rotatedAt: () => 'now()',
        lastUsedAt: () => 'now()',
      })
      .where('id = :id', { id })
      .andWhere('token_hash = :currentTokenHash', { currentTokenHash })
      .execute();
    if (!result.affected) return null;

    const entity = await this.repository(manager).findOne({ where: { id } });

    return RefreshTokenTransformer.fromEntity(entity);
  }

  public async revoke(id: string, manager?: EntityManager): Promise<boolean> {
    if (!id) return false;

    const result = await this.repository(manager)
      .createQueryBuilder()
      .update()
      .set({ revokedAt: () => 'now()' })
      .where('id = :id', { id })
      .andWhere('revoked_at IS NULL')
      .execute();

    return result.affected > 0;
  }

  public async revokeAllForIdentity(
    identityId: string,
    exceptId?: string,
    manager?: EntityManager,
  ): Promise<number> {
    if (!identityId) return 0;

    const query = this.repository(manager)
      .createQueryBuilder()
      .update()
      .set({ revokedAt: () => 'now()' })
      .where('identity_id = :identityId', { identityId })
      .andWhere('revoked_at IS NULL');

    if (exceptId) {
      query.andWhere('id <> :exceptId', { exceptId });
    }

    const result = await query.execute();

    return result.affected ?? 0;
  }

  public async deleteExpiredOrRevokedBefore(
    expiredBefore: Date,
    revokedBefore: Date = expiredBefore,
  ): Promise<number> {
    const result = await this.refreshTokenRepository
      .createQueryBuilder()
      .delete()
      .where('expires_at < :expiredBefore', { expiredBefore })
      .orWhere('revoked_at < :revokedBefore', { revokedBefore })
      .execute();

    return result.affected ?? 0;
  }

  private repository(manager?: EntityManager): Repository<RefreshTokenEntity> {
    return manager
      ? manager.getRepository(RefreshTokenEntity)
      : this.refreshTokenRepository;
  }
}
