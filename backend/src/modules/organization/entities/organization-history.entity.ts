import {
  HistoryActionColumn,
  HistoryActionType,
  HistoryEntityInterface,
  HistoryOriginalIdColumn,
} from '@anchan828/typeorm-history';
import { Entity } from 'typeorm';
import { Organization } from '../entities';

@Entity()
export class OrganizationHistory
  extends Organization
  implements HistoryEntityInterface
{
  @HistoryOriginalIdColumn({ name: 'history_original_id' })
  originalID: number;

  @HistoryActionColumn({ name: 'history_action' })
  action: HistoryActionType;
}
