import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity } from 'typeorm';

@Entity({ name: '_application-label' })
export class ApplicationLabel extends BaseEntity {
  @Column({ type: 'text', name: 'name' })
  name: string;
}
