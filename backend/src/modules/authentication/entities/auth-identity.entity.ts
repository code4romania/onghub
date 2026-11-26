import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { AuthTimestamps } from './auth-timestamps';

/**
 * The login of one NGO Hub user. Email, name, status and role stay on `user`
 * (user.email is unique and cannot be changed through the API), so they are
 * not duplicated here.
 */
@Entity({ name: 'auth_identity' })
export class AuthIdentityEntity extends AuthTimestamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer', name: 'user_id' }) // unique via the OneToOne
  userId: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  /** Set after a successful login with link or code; drives `email_verified` in OIDC. */
  @Column({ type: 'timestamptz', name: 'email_verified_at', nullable: true })
  emailVerifiedAt: Date;

  @Column({ type: 'timestamptz', name: 'last_login_at', nullable: true })
  lastLoginAt: Date;
}
