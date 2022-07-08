import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity } from 'typeorm';
import { Role } from '../enums/role.enum';
import { UserStatus } from '../enums/user-status.enum';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'enum', enum: Role, name: 'role' })
  role: Role;

  @Column({ type: 'varchar', name: 'email' })
  email: string;

  @Column({ type: 'varchar', name: 'phone' })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    name: 'status',
    default: UserStatus.PENDING,
  })
  status: UserStatus;
}
