import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity } from 'typeorm';
import { OrganizationStatus } from '../enums/organization-status.enum';

@Entity()
export class Organization extends BaseEntity {
  @Column({ type: 'timestamp with time zone', name: 'synced_on' })
  syncedOn: Date;

  @Column({
    type: 'enum',
    enum: OrganizationStatus,
    name: 'status',
  })
  status: OrganizationStatus;
}
