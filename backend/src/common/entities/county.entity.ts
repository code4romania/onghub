import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/base-entity.class';

@Entity({ name: '_county' })
export class County extends BaseEntity {
  @Column({ type: 'text', name: 'name' })
  name: string;
}
