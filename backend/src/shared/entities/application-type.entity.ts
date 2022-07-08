import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity, OneToMany } from 'typeorm';
import { Application } from '../../modules/application/entities/application.entity';

@Entity({ name: '_application_type' })
export class ApplicationType extends BaseEntity {
  @Column({ type: 'text', name: 'type' })
  type: string;

  @OneToMany(() => Application, (application) => application.type)
  application: Application;
}
