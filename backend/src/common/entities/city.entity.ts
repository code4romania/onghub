import { ActivityToCity } from 'src/organization/entities/activity-to-city.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base/base-entity.class';

@Entity({ name: '_city' })
export class City extends BaseEntity {
  @Column({ type: 'text', name: 'name' })
  name: string;

  @OneToMany(() => ActivityToCity, (activityToCity) => activityToCity.city)
  public activityToCities: ActivityToCity[];
}
