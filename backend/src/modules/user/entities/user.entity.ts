import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/base/base-entity.class';
import { Organization } from 'src/modules/organization/entities';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Role } from '../enums/role.enum';
import { UserStatus } from '../enums/user-status.enum';
import { Request } from '../../requests/entities/request.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', name: 'cognito_id', unique: true, nullable: true })
  cognitoId: string;

  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'varchar', name: 'email', unique: true })
  email: string;

  @Column({ type: 'varchar', name: 'phone' })
  phone: string;

  /* ROLE will be handled differently, depending who is creating the user

    1. Creating a new organization will also create the admin (with role Admin)
    2. Creating a new user by the ONG Admin will create employee

  */
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

  @ManyToOne((type) => Organization)
  @JoinColumn({ name: 'organization_id' })
  organization: Organization;

  @OneToMany(() => Request, (request) => request.user, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  requests: Request[];
}
