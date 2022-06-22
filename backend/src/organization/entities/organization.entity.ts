import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { OrganizationStatus } from '../enums/organization-status.enum';
import { OrganizationGeneral } from './organization-general.entity';

@Entity()
export class Organization extends BaseEntity {
  @Column({
    type: 'timestamp with time zone',
    name: 'synced_on',
    default: new Date(),
  })
  syncedOn: Date;

  @Column({
    type: 'enum',
    enum: OrganizationStatus,
    name: 'status',
    default: OrganizationStatus.PENDING,
  })
  status: OrganizationStatus;

  @OneToOne(
    () => OrganizationGeneral,
    (organizationGeneral) => organizationGeneral.organization,
    { cascade: true },
  )
  @JoinColumn()
  organizationGeneral: OrganizationGeneral;
}
