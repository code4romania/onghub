import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/base-entity.class';

@Entity({ name: '_city' })
export class City extends BaseEntity {
  @Column({ type: 'text', name: 'name' })
  name: string;
}
