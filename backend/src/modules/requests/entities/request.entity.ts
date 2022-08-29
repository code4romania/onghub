import { BaseEntity } from 'src/common/base/base-entity.class';
import { Application } from 'src/modules/application/entities/application.entity';
import { Organization } from 'src/modules/organization/entities';
import { User } from 'src/modules/user/entities/user.entity';
import { Entity, Column, JoinColumn, OneToOne, ManyToOne } from 'typeorm';
import { RequestStatus } from '../enums/request-status.enum';
import { RequestType } from '../enums/request-type.enum';

@Entity({ name: 'request' })
export class Request extends BaseEntity {
  @Column({
    type: 'enum',
    enum: RequestStatus,
    name: 'status',
    default: RequestStatus.PENDING,
  })
  status: RequestStatus;

  @Column({
    type: 'enum',
    enum: RequestType,
    name: 'type',
  })
  type: RequestType;

  @Column({ type: 'integer', nullable: true, name: 'organization_id' })
  organizationId: number;

  @OneToOne((type) => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @Column({ type: 'integer', nullable: true, name: 'application_id' })
  applicationId: number;

  @OneToOne((type) => Application)
  @JoinColumn({ name: 'application_id' })
  application: Application;

  @Column({ type: 'integer', nullable: true, name: 'user_id' })
  userId: number;

  @ManyToOne((type) => Application)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
