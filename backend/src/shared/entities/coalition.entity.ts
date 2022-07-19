import { BaseEntity } from 'src/common/base/base-entity.class';
import { OrganizationActivity } from 'src/modules/organization/entities';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity({ name: '_coalition' })
export class Coalition extends BaseEntity {
  @Column({ type: 'text', name: 'name' })
  name: string;

  @Column({ type: 'text', name: 'abbreviation' })
  abbreviation: string;

  @ManyToMany(
    (type) => OrganizationActivity,
    (organizationActivity) => organizationActivity.coalitions,
  )
  organizationActivities: OrganizationActivity[];
}
