import { BaseEntity } from 'src/common/base/base-entity.class';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserOngApplicationStatus } from '../enums/user-ong-application-status.enum';
import { OngApplication } from './ong-application.entity';

@Entity('user_ong_application')
export class UserOngApplication extends BaseEntity {
  @Column({ type: 'integer', name: 'user_id' })
  userId: number;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'integer', name: 'application_id' })
  applicationId: number;

  @ManyToOne((type) => OngApplication)
  @JoinColumn({ name: 'application_id' })
  application: OngApplication;

  @Column({
    type: 'enum',
    enum: UserOngApplicationStatus,
    name: 'status',
    default: UserOngApplicationStatus.PENDING,
  })
  status: UserOngApplicationStatus;
}
