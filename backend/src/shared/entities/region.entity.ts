import { BaseEntity } from 'src/common/base/base-entity.class';
import { OrganizationActivity } from 'src/modules/organization/entities';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { County } from './county.entity';

@Entity({ name: '_region' })
export class Region extends BaseEntity {
  @Column({ type: 'text', name: 'name' })
  name: string;

  @OneToMany(() => County, (county) => county.region)
  counties: County[];

  @ManyToMany(
    (type) => OrganizationActivity,
    (organizationActivity) => organizationActivity.regions,
  )
  organizationActivities: OrganizationActivity[];
}
