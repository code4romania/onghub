import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/base/base-entity.class';
import { Organization } from 'src/modules/organization/entities';
import { User } from 'src/modules/user/entities/user.entity';
import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { RequestStatus } from '../enums/request-status.enum';

@Entity({ name: 'request' })
export class Request extends BaseEntity {
  @Column({
    type: 'enum',
    enum: RequestStatus,
    name: 'status',
    default: RequestStatus.PENDING,
  })
  status?: RequestStatus;

  // ADMIN ACCOUNT DETAILS
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'varchar', name: 'email' })
  email: string;

  @Column({ type: 'varchar', name: 'phone' })
  phone: string;

  @Column({ type: 'varchar', name: 'organization_name', nullable: true })
  organizationName: string;

  @Exclude()
  @Column({ type: 'integer', nullable: true, name: 'organization_id' })
  organizationId: number;

  @ManyToOne((type) => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}
