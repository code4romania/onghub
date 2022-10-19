import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity } from 'typeorm';

@Entity({ name: '_faculty' })
export class Faculty extends BaseEntity {
  @Column({ type: 'text', name: 'name' })
  name: string;
}
