import {
  HistoryActionColumn,
  HistoryActionType,
  HistoryEntityInterface,
  HistoryOriginalIdColumn,
} from '@anchan828/typeorm-history';
import { BaseEntity } from 'src/common/base/base-entity.class';
import { Column, Entity } from 'typeorm';
import { OngApplicationStatus } from '../enums/ong-application-status.enum';

@Entity()
export class OngApplicationHistory
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

  @Column({ type: 'integer', name: 'organization_id' })
  organizationId: number;

  @Column({ type: 'integer', name: 'application_id' })
  applicationId: number;

  @Column({
    type: 'enum',
    enum: OngApplicationStatus,
    name: 'status',
    default: OngApplicationStatus.PENDING,
  })
  status: OngApplicationStatus;
}
