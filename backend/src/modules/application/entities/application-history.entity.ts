import {
  HistoryActionColumn,
  HistoryActionType,
  HistoryEntityInterface,
  HistoryOriginalIdColumn,
} from '@anchan828/typeorm-history';
import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity } from 'typeorm';
import { ApplicationStatus } from '../enums/application-status.enum';
import { ApplicationTypeEnum } from '../enums/ApplicationType.enum';

@Entity()
export class ApplicationHistory
  extends BaseEntity
  implements HistoryEntityInterface
{
  @HistoryOriginalIdColumn({ name: 'history_original_id' })
  originalID: number;

  @HistoryActionColumn({ name: 'history_action' })
  action: HistoryActionType;

  /**
   =============================================================
    Inherited properties

    WARNING: Make sure to keep the properties in sync between
    the parent entity (Application) and the History table
   =============================================================
   */

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

  @Column({ type: 'text', name: 'management_url', nullable: true })
  managementUrl: string;
}
