import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity, OneToMany } from 'typeorm';
import { ApplicationPullingType } from '../enums/application-pulling-type.enum';
import { ApplicationStatus } from '../enums/application-status.enum';
import { ApplicationTypeEnum } from '../enums/ApplicationType.enum';
import { OngApplication } from './ong-application.entity';

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

  @Column({
    type: 'enum',
    enum: ApplicationPullingType,
    name: 'pulling_type',
    nullable: true,
  })
  pullingType: ApplicationPullingType;

  @Column({ type: 'jsonb', name: 'steps', nullable: true })
  steps: string[];

  @Column({ type: 'text', name: 'short_description' })
  shortDescription: string;

  @Column({ type: 'text', name: 'description' })
  description: string;

  @Column({ type: 'text', name: 'website' })
  website: string;

  @Column({ type: 'text', name: 'login_link', nullable: true })
  loginLink: string;

  @Column({ type: 'text', name: 'video_link', nullable: true })
  videoLink: string;

  @Column({ type: 'text', name: 'logo', nullable: true })
  logo: string;

  // Application Client Id
  @Column({ type: 'text', name: 'cognito_client_id', nullable: true })
  cognitoClientId: string;

  @OneToMany(() => OngApplication, (ongApp) => ongApp.application)
  ongApplications: OngApplication[];
}
