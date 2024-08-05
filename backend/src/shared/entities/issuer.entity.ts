import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity } from 'typeorm';

@Entity({ name: '_issuer' })
export class Issuer extends BaseEntity {
  @Column({ type: 'text', name: 'name' })
  name: string;
}
