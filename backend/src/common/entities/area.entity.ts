import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/base-entity.class';

@Entity({ name: '_area' })
export class Area extends BaseEntity {
  @Column({ type: 'text', name: 'name' })
  name: string;
}
