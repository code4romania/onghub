import { ActivityToDomain } from 'src/organization/entities/activity-to-domain.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base/base-entity.class';

@Entity({ name: '_domain' })
export class Domain extends BaseEntity {
  @Column({ type: 'text', name: 'name' })
  name: string;

  @OneToMany(
    () => ActivityToDomain,
    (activityToDomain) => activityToDomain.domain,
  )
  public activityToDomains: ActivityToDomain[];
}
