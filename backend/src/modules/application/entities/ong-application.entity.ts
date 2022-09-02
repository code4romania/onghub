import { BaseEntity } from 'src/common/base/base-entity.class';
import { Organization } from 'src/modules/organization/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { OngApplicationStatus } from '../enums/ong-application-status.enum';
import { Application } from './application.entity';

@Entity('ong_application')
export class OngApplication extends BaseEntity {
  @Column({ type: 'integer', name: 'organization_id' })
  organizationId: number;

  @ManyToOne((type) => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ type: 'integer', name: 'application_id' })
  applicationId: number;

  @ManyToOne((type) => Application)
  @JoinColumn({ name: 'application_id' })
  application: Application;

  @Column({
    type: 'enum',
    enum: OngApplicationStatus,
    name: 'status',
    default: OngApplicationStatus.PENDING,
  })
  status: OngApplicationStatus;
}
