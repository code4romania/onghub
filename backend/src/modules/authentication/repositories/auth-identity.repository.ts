import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AuthIdentityEntity } from '../entities/auth-identity.entity';
import {
  AuthIdentityTransformer,
  CreateAuthIdentityOptions,
  FindAuthIdentityOptions,
  IAuthIdentityModel,
  LoginState,
  UpdateAuthIdentityOptions,
  UpsertAuthIdentityResult,
} from '../models/auth-identity.model';

@Injectable()
export class AuthIdentityRepository {
  constructor(
    @InjectRepository(AuthIdentityEntity)
    private readonly authIdentityRepository: Repository<AuthIdentityEntity>,
  ) {}

  public async find(
    options: FindAuthIdentityOptions,
    manager?: EntityManager,
  ): Promise<IAuthIdentityModel> {
    // TypeORM 0.3.20 drops null/undefined `where` keys, so { userId: undefined }
    // would match the first row. Refuse empty lookups outright.
    if (Object.values(options).some((value) => !value)) return null;

    if ('email' in options) {
      const entity = await this.repository(manager)
        .createQueryBuilder('identity')
        .innerJoin('identity.user', 'user')
        .where('lower(user.email) = :email', {
          email: AuthIdentityTransformer.normalizeEmail(options.email),
        })
        .andWhere('user.deleted_on IS NULL')
        .getOne();
      return AuthIdentityTransformer.fromEntity(entity);
    }

    const entity = await this.repository(manager).findOne({ where: options });
    return AuthIdentityTransformer.fromEntity(entity);
  }

  public async create(
    options: CreateAuthIdentityOptions,
    manager?: EntityManager,
  ): Promise<IAuthIdentityModel> {
    const entity = await this.repository(manager).save(
      AuthIdentityTransformer.toEntity(options),
    );
    return this.find({ id: entity.id }, manager);
  }

  public async update(
    id: string,
    options: UpdateAuthIdentityOptions,
    manager?: EntityManager,
  ): Promise<IAuthIdentityModel> {
    if (!id) return null;
    await this.repository(manager).update({ id }, options);
    return this.find({ id }, manager);
  }

  /** ON CONFLICT (user_id) DO NOTHING: running the migration twice changes nothing (O9). */
  public async upsert(
    options: CreateAuthIdentityOptions,
    manager?: EntityManager,
  ): Promise<UpsertAuthIdentityResult> {
    if (!options.userId) throw new Error('userId is required');

    const result = await this.repository(manager)
      .createQueryBuilder()
      .insert()
      .values(AuthIdentityTransformer.toEntity(options))
      .orIgnore()
      .returning(['id'])
      .execute();

    const created = result.raw.length > 0;
    const identity = await this.find(
      created ? { id: result.raw[0].id } : { userId: options.userId },
      manager,
    );
    return { identity, created };
  }

  /** Identity + its user and organization statuses, or null. */
  public async findLoginState(identityId: string): Promise<LoginState> {
    if (!identityId) return null;
    const row = await this.authIdentityRepository
      .createQueryBuilder('identity')
      .innerJoin('identity.user', 'user')
      .leftJoin('organization', 'org', 'org.id = user.organization_id')
      .select('identity')
      .addSelect([
        'user.id AS user_id',
        'user.email AS user_email',
        'user.status AS user_status',
        'user.role AS user_role',
        'org.id AS org_id',
        'org.status AS org_status',
      ])
      .where('identity.id = :identityId', { identityId })
      .andWhere('user.deleted_on IS NULL')
      .getRawAndEntities();
    const entity = row.entities[0];
    const raw = row.raw[0];
    if (!entity || !raw) return null;
    return {
      identity: AuthIdentityTransformer.fromEntity(entity),
      userId: raw.user_id,
      email: raw.user_email,
      userStatus: raw.user_status,
      role: raw.user_role,
      organizationId: raw.org_id ?? null,
      organizationStatus: raw.org_status ?? null,
    };
  }

  /** Hard delete: tokens, sessions and provider links cascade. */
  public async deleteByUserId(
    userId: number,
    manager?: EntityManager,
  ): Promise<number> {
    if (!userId) return 0;
    const result = await this.repository(manager)
      .createQueryBuilder()
      .delete()
      .where('user_id = :userId', { userId })
      .execute();
    return result.affected ?? 0;
  }

  private repository(manager?: EntityManager): Repository<AuthIdentityEntity> {
    return manager
      ? manager.getRepository(AuthIdentityEntity)
      : this.authIdentityRepository;
  }
}
