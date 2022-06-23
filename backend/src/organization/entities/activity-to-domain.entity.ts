import { BaseEntity } from 'src/common/base/base-entity.class';
import { Domain } from 'src/common/entities';
import { Entity, Column, ManyToOne } from 'typeorm';
import { OrganizationActivity } from './organization-activity.entity';

@Entity()
export class ActivityToDomain extends BaseEntity {
  @Column({ type: 'integer', name: 'oragnization_activity_id' })
  oragnizationActivityId: number;

  @Column({ type: 'integer', name: 'domain_id' })
  doaminId: number;

  @ManyToOne(() => Domain, (domain) => domain.activityToDomains)
  public domain: Domain;

  @ManyToOne(
    () => OrganizationActivity,
    (oragnizationActivity) => oragnizationActivity.activityToDomains,
  )
  public oragnizationActivity: OrganizationActivity;
}
