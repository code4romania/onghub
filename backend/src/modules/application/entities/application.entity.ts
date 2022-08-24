import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity } from 'typeorm';
import { ApplicationStatus } from '../enums/application-status.enum';
import { ApplicationTypeEnum } from '../enums/ApplicationType.enum';

@Entity()
export class Application extends BaseEntity {
  @Column({ type: 'text', name: 'name' })
  name: string;

  @Column({
    type: 'enum',
    enum: ApplicationTypeEnum,
    name: 'type',
  })
  type: ApplicationTypeEnum;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    name: 'status',
    default: ApplicationStatus.ACTIVE,
  })
  status: ApplicationStatus;

  @Column({ type: 'jsonb', name: 'steps' })
  steps: string[];

  @Column({ type: 'text', name: 'short_description' })
  shortDescription: string;

  @Column({ type: 'text', name: 'description' })
  description: string;

  @Column({ type: 'text', name: 'website' })
  website: string;

  @Column({ type: 'text', name: 'login_link', nullable: true })
  loginLink: string;

  @Column({ type: 'text', name: 'video_link' })
  videoLink: string;

  @Column({ type: 'text', name: 'logo', nullable: true })
  logo: string;
}
