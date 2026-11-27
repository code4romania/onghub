import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { AuthTokenForm, AuthTokenType } from '../enums/auth.enums';
import { AuthIdentityEntity } from './auth-identity.entity';
import { AuthTimestamps } from './auth-timestamps';

@Entity({ name: 'auth_token' })
// Finds the live token of a type for an identity.
@Index('auth_token_live_identity_type', ['identityId', 'type'], {
  where: '"used_at" IS NULL AND "replaced_at" IS NULL',
})
export class AuthTokenEntity extends AuthTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'identity_id' })
  identityId: string;

  @ManyToOne(() => AuthIdentityEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'identity_id' })
  identity: AuthIdentityEntity;

  @Column({
    type: 'enum',
    enum: AuthTokenType,
    name: 'type',
  })
  type: AuthTokenType;

  @Column({
    type: 'enum',
    enum: AuthTokenForm,
    name: 'form',
  })
  form: AuthTokenForm;

  /** Only the HMAC of the secret is stored. */
  @Column({ type: 'text', name: 'token_hash', unique: true })
  tokenHash: string;

  @Column({ type: 'timestamptz', name: 'expires_at' })
  expiresAt: Date;

  @Column({ type: 'timestamptz', name: 'used_at', nullable: true })
  usedAt: Date;

  @Column({ type: 'timestamptz', name: 'replaced_at', nullable: true })
  replacedAt: Date;

  @Column({ type: 'integer', name: 'attempts', default: 0 })
  attempts: number;

  @Column({ type: 'text', name: 'sent_to', nullable: true })
  sentTo: string;

  @Column({ type: 'integer', name: 'sent_by', nullable: true })
  sentById: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'sent_by' })
  sentBy: User;
}
