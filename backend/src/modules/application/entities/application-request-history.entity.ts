import {
  HistoryActionColumn,
  HistoryActionType,
  HistoryEntityInterface,
  HistoryOriginalIdColumn,
} from '@anchan828/typeorm-history';
import { Application } from 'src/modules/application/entities/application.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Request } from '../../../shared/entities/request.entity';

@Entity({ name: 'application_request_history' })
export class ApplicationRequestHistory
  extends Request
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
    the parent entity (ApplicationRequest) and the History table
   =============================================================
   */

  @Column({ type: 'integer', nullable: true, name: 'application_id' })
  applicationId: number;

  @ManyToOne((type) => Application)
  @JoinColumn({ name: 'application_id' })
  application: Application;
}
