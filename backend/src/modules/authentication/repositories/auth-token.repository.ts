import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindOptionsWhere,
  IsNull,
  MoreThan,
  Repository,
} from 'typeorm';
import { AuthTokenEntity } from '../entities/auth-token.entity';
import { AuthTokenType } from '../enums/auth.enums';
import {
  AuthTokenTransformer,
  CreateAuthTokenOptions,
  IAuthTokenModel,
} from '../models/auth-token.model';

@Injectable()
export class AuthTokenRepository {
  constructor(
    @InjectRepository(AuthTokenEntity)
    private readonly authTokenRepository: Repository<AuthTokenEntity>,
  ) {}

  public async create(
    options: CreateAuthTokenOptions,
    manager?: EntityManager,
  ): Promise<IAuthTokenModel> {
    const entity = await this.repository(manager).save(
      AuthTokenTransformer.toEntity(options),
    );

    const created = await this.repository(manager).findOne({
      where: { id: entity.id },
      relations: { identity: true },
    });

    return AuthTokenTransformer.fromEntity(created);
  }

  public async findByHash(tokenHash: string): Promise<IAuthTokenModel> {
    if (!tokenHash) return null;

    return this.findOne({ tokenHash, ...this.live() });
  }

  public async findAnyByHash(tokenHash: string): Promise<IAuthTokenModel> {
    if (!tokenHash) return null;

    return this.findOne({ tokenHash });
  }

  public async findLiveToken(
    identityId: string,
    type: AuthTokenType,
  ): Promise<IAuthTokenModel> {
    if (!identityId || !type) return null;

    return this.findOne({ identityId, type, ...this.live() });
  }

  public async replaceLiveTokens(
    identityId: string,
    types: AuthTokenType[],
    manager?: EntityManager,
  ): Promise<number> {
    if (!identityId || !types.length) return 0;

    const result = await this.repository(manager)
      .createQueryBuilder()
      .update()
      .set({ replacedAt: () => 'now()' })
      .where('identity_id = :identityId', { identityId })
      .andWhere('type IN (:...types)', { types })
      .andWhere('used_at IS NULL')
      .andWhere('replaced_at IS NULL')
      .execute();

    return result.affected ?? 0;
  }

  // Returns false when the row was already used, so two concurrent requests cannot both consume it.
  public async consume(id: string, manager?: EntityManager): Promise<boolean> {
    if (!id) return false;

    const result = await this.repository(manager)
      .createQueryBuilder()
      .update()
      .set({ usedAt: () => 'now()' })
      .where('id = :id', { id })
      .andWhere('used_at IS NULL')
      .execute();

    return result.affected > 0;
  }

  public async incrementAttempts(id: string): Promise<number> {
    if (!id) return null;

    const result = await this.authTokenRepository
      .createQueryBuilder()
      .update()
      .set({ attempts: () => '"attempts" + 1' })
      .where('id = :id', { id })
      .returning(['attempts'])
      .execute();

    return result.raw[0]?.attempts ?? null;
  }

  // Takes one of the code's attempts, in one statement: the new count, or null when all `max` were taken.
  // Taken before the code is compared, so parallel guesses cannot all be compared while the count lags.
  public async claimAttempt(id: string, max: number): Promise<number> {
    if (!id) return null;

    const result = await this.authTokenRepository
      .createQueryBuilder()
      .update()
      .set({ attempts: () => '"attempts" + 1' })
      .where('id = :id AND "attempts" < :max', { id, max })
      .returning(['attempts'])
      .execute();

    return result.raw[0]?.attempts ?? null;
  }

  // The newest token of a type for a login, in any state (the Team page's "last invite sent").
  public async findLatest(
    identityId: string,
    type: AuthTokenType,
  ): Promise<IAuthTokenModel> {
    if (!identityId || !type) return null;

    const entity = await this.authTokenRepository.findOne({
      where: { identityId, type },
      order: { createdOn: 'DESC' },
    });
    return AuthTokenTransformer.fromEntity(entity);
  }

  // A row has ended once it was used, replaced or expired; any of those before the date is enough.
  public async deleteEndedBefore(date: Date): Promise<number> {
    const result = await this.authTokenRepository
      .createQueryBuilder()
      .delete()
      .where('used_at < :date', { date })
      .orWhere('replaced_at < :date', { date })
      .orWhere('expires_at < :date', { date })
      .execute();

    return result.affected ?? 0;
  }

  private live(): FindOptionsWhere<AuthTokenEntity> {
    return {
      usedAt: IsNull(),
      replacedAt: IsNull(),
      expiresAt: MoreThan(new Date()),
    };
  }

  private async findOne(
    where: FindOptionsWhere<AuthTokenEntity>,
  ): Promise<IAuthTokenModel> {
    const entity = await this.authTokenRepository.findOne({
      where,
      relations: { identity: true },
    });

    return AuthTokenTransformer.fromEntity(entity);
  }

  private repository(manager?: EntityManager): Repository<AuthTokenEntity> {
    return manager
      ? manager.getRepository(AuthTokenEntity)
      : this.authTokenRepository;
  }
}
