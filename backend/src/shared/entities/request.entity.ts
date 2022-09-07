import { BaseEntity } from 'src/common/base/base-entity.class';
import { Organization } from 'src/modules/organization/entities';
import { Column, JoinColumn, OneToOne } from 'typeorm';
import { RequestStatus } from '../../modules/organization/enums/request-status.enum';

export abstract class Request extends BaseEntity {
  @Column({
    type: 'enum',
    enum: RequestStatus,
    name: 'status',
    default: RequestStatus.PENDING,
  })
  status: RequestStatus;

  @Column({ type: 'integer', nullable: true, name: 'organization_id' })
  organizationId: number;

  @OneToOne((type) => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}
