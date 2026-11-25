import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Auth rows are hard-deleted (tokens, sessions and links cascade with the
 * identity), so unlike BaseEntity there is no deleted_on and no integer id.
 */
export abstract class AuthTimestamps {
  @CreateDateColumn({ name: 'created_on', type: 'timestamp with time zone' })
  createdOn: Date;

  @UpdateDateColumn({ name: 'updated_on', type: 'timestamp with time zone' })
  updatedOn: Date;
}
