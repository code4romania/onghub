import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuthIdentityEntity } from './auth-identity.entity';
import { AuthTimestamps } from './auth-timestamps';

@Entity({ name: 'refresh_token' })
export class RefreshTokenEntity extends AuthTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('refresh_token_identity_id')
  @Column({ type: 'uuid', name: 'identity_id' })
  identityId: string;

  @ManyToOne(() => AuthIdentityEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'identity_id' })
  identity: AuthIdentityEntity;

  @Column({ type: 'text', name: 'token_hash', unique: true })
  tokenHash: string;

  @Index('refresh_token_previous_hash')
  @Column({ type: 'text', name: 'previous_hash', nullable: true })
  previousHash: string;

  @Column({ type: 'timestamptz', name: 'rotated_at', nullable: true })
  rotatedAt: Date;

  @Column({ type: 'timestamptz', name: 'expires_at' })
  expiresAt: Date;

  @Column({ type: 'timestamptz', name: 'revoked_at', nullable: true })
  revokedAt: Date;

  @Column({ type: 'timestamptz', name: 'last_used_at', nullable: true })
  lastUsedAt: Date;

  @Column({ type: 'text', name: 'user_agent', nullable: true })
  userAgent: string;

  @Column({ type: 'text', name: 'ip', nullable: true })
  ip: string;
}
