import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity, OneToOne } from 'typeorm';
import { Application } from '../../modules/application/entities/application.entity';
import { ApplicationTypes } from '../../modules/application/enums/application-type.enum';

@Entity({ name: '_application-type' })
export class ApplicationType extends BaseEntity {
  @Column({ type: 'enum', enum: ApplicationTypes, name: 'name' })
  name: ApplicationTypes;

  @OneToOne(() => Application, (application) => application.type)
  application: Application;
}
