import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/base/base-entity.class';
import { Organization } from 'src/modules/organization/entities';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Role } from '../enums/role.enum';
import { UserStatus } from '../enums/user-status.enum';
@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', name: 'cognito_id', unique: true, nullable: true })
  cognitoId: string;

  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'varchar', name: 'email', unique: true })
  email: string;

  @Column({ type: 'varchar', name: 'phone', nullable: true })
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

  @ManyToOne((type) => Organization, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;
}
