import { BaseEntity } from 'src/common/base/base-entity.class';
import { City } from 'src/common/entities/city.entity';
import { Entity, Column, ManyToOne } from 'typeorm';
import { OrganizationActivity } from './organization-activity.entity';

@Entity()
export class ActivityToCity extends BaseEntity {
  @Column({ type: 'integer', name: 'oragnization_activity_id' })
  oragnizationActivityId: number;

  @Column({ type: 'integer', name: 'city_id' })
  cityId: number;

  @ManyToOne(() => City, (city) => city.activityToCities)
  public city: City;

  @ManyToOne(
    () => OrganizationActivity,
    (oragnizationActivity) => oragnizationActivity.activityToCities,
  )
  public oragnizationActivity: OrganizationActivity;
}
