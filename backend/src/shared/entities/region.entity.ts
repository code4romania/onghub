import { BaseEntity } from 'src/common/base/base-entity.class';
import { OrganizationActivity } from 'src/modules/organization/entities';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity({ name: '_region' })
export class Region extends BaseEntity {
  @Column({ type: 'text', name: 'name' })
  name: string;

  @ManyToMany(
    (type) => OrganizationActivity,
    (organizationActivity) => organizationActivity.regions,
  )
  organizationActivities: OrganizationActivity[];
}
