import { BaseEntity } from 'src/common/base/base-entity.class';
import { OrganizationActivity } from 'src/modules/organization/entities';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity({ name: '_federation' })
export class Federation extends BaseEntity {
  @Column({ type: 'text', name: 'name' })
  name: string;

  @Column({ type: 'text', name: 'abbreviation' })
  abbreviation: string;

  @ManyToMany(
    (type) => OrganizationActivity,
    (organizationActivity) => organizationActivity.federations,
  )
  organizationActivities: OrganizationActivity[];
}
