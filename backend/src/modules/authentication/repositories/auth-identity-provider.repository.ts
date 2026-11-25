import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AuthIdentityProviderEntity } from '../entities/auth-identity-provider.entity';
import { AuthProvider } from '../enums/auth.enums';
import {
  AuthIdentityProviderTransformer,
  CreateAuthIdentityProviderOptions,
  IAuthIdentityProviderModel,
} from '../models/auth-identity-provider.model';

@Injectable()
export class AuthIdentityProviderRepository {
  constructor(
    @InjectRepository(AuthIdentityProviderEntity)
    private readonly authIdentityProviderRepository: Repository<AuthIdentityProviderEntity>,
  ) {}

  public async findByProvider(
    provider: AuthProvider,
    subject: string,
  ): Promise<IAuthIdentityProviderModel> {
    if (!provider || !subject) return null;

    const entity = await this.authIdentityProviderRepository.findOne({
      where: { provider, subject },
    });

    return AuthIdentityProviderTransformer.fromEntity(entity);
  }

  public async linkProvider(
    options: CreateAuthIdentityProviderOptions,
    manager?: EntityManager,
  ): Promise<IAuthIdentityProviderModel> {
    const repository = manager
      ? manager.getRepository(AuthIdentityProviderEntity)
      : this.authIdentityProviderRepository;

    const entity = await repository.save(
      AuthIdentityProviderTransformer.toEntity(options),
    );

    return AuthIdentityProviderTransformer.fromEntity(entity);
  }
}
