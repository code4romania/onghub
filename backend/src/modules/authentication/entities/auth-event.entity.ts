import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Append-only auth journal (O14). No foreign keys on purpose: rows outlive
 * deleted users and clients. Kept >= 90 days. Never holds tokens or secrets.
 */
@Entity({ name: 'auth_event' })
export class AuthEventEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: string;

  @Column({ type: 'text', name: 'type' })
  type: string;

  @Index('auth_event_user_id')
  @Column({ type: 'integer', name: 'user_id', nullable: true })
  userId: number;

  @Column({ type: 'text', name: 'client_id', nullable: true })
  clientId: string;

  @Column({ type: 'text', name: 'reason', nullable: true })
  reason: string;

  @Column({ type: 'text', name: 'ip', nullable: true })
  ip: string;

  @Index('auth_event_created_on')
  @CreateDateColumn({ name: 'created_on', type: 'timestamp with time zone' })
  createdOn: Date;
}
