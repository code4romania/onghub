import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { AuthProvider } from '../enums/auth.enums';
import { AuthIdentityEntity } from './auth-identity.entity';
import { AuthTimestamps } from './auth-timestamps';

@Entity({ name: 'auth_identity_provider' })
@Unique('auth_identity_provider_provider_subject_unique', [
  'provider',
  'subject',
])
export class AuthIdentityProviderEntity extends AuthTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'identity_id' })
  identityId: string;

  @ManyToOne(() => AuthIdentityEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'identity_id' })
  identity: AuthIdentityEntity;

  @Column({
    type: 'enum',
    enum: AuthProvider,
    name: 'provider',
  })
  provider: AuthProvider;

  @Column({ type: 'text', name: 'subject' })
  subject: string;

  @Column({ type: 'text', name: 'email_at_link', nullable: true })
  emailAtLink: string;
}
