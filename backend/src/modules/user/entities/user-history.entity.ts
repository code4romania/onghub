import {
  HistoryActionColumn,
  HistoryActionType,
  HistoryEntityInterface,
  HistoryOriginalIdColumn,
} from '@anchan828/typeorm-history';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/base/base-entity.class';
import { Organization } from 'src/modules/organization/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Role } from '../enums/role.enum';
import { UserStatus } from '../enums/user-status.enum';
@Entity()
export class UserHistory extends BaseEntity implements HistoryEntityInterface {
  @HistoryOriginalIdColumn({ name: 'history_original_id' })
  originalID: number;

  @HistoryActionColumn({ name: 'history_action' })
  action: HistoryActionType;

  /**
   =============================================================
    Inherited properties

    WARNING: Make sure to keep the properties in sync between
    the parent entity (User) and the History table
   =============================================================
   */

  @Column({ type: 'varchar', name: 'cognito_id', unique: true, nullable: true })
  cognitoId: string;

  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'varchar', name: 'email', unique: true })
  email: string;

  @Column({ type: 'varchar', name: 'phone' })
  phone: string;

  @Column({ type: 'enum', enum: Role, name: 'role', default: Role.EMPLOYEE })
  role: Role;

  @Column({
    type: 'enum',
    enum: UserStatus,
    name: 'status',
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @Exclude()
  @Column({ type: 'integer', nullable: true, name: 'organization_id' })
  organizationId: number;
}
