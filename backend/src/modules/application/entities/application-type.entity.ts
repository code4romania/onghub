import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity, OneToOne } from 'typeorm';
import { Application } from './application.entity';

@Entity({ name: '_application-type' })
export class ApplicationType extends BaseEntity {
  @Column({ type: 'text', name: 'name' })
  name: string;

  @OneToOne(() => Application, (application) => application.type)
  application: Application;
}
