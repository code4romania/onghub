import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base/base-entity.class';

@Entity()
export class Contact extends BaseEntity {
  @Column({ type: 'text', name: 'full_name' })
  fullName: string;

  @Column({ type: 'text', name: 'email', unique: true })
  email: string;

  @Column({ type: 'text', name: 'phone' })
  phone: string;
}
