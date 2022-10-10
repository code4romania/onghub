import {
  HistoryActionColumn,
  HistoryActionType,
  HistoryEntityInterface,
  HistoryOriginalIdColumn,
} from '@anchan828/typeorm-history';
import { Column, Entity } from 'typeorm';
import { Request } from '../../../shared/entities/request.entity';

@Entity({ name: 'organization_request_history' })
export class OrganizationRequestHistory
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
    the parent entity (OrganizationRequest) and the History table
   =============================================================
   */

  // ADMIN ACCOUNT DETAILS
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Column({ type: 'varchar', name: 'email' })
  email: string;

  @Column({ type: 'varchar', name: 'phone' })
  phone: string;

  @Column({ type: 'varchar', name: 'organization_name' })
  organizationName: string;
}
