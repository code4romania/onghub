import { HistoryEntitySubscriber } from '@anchan828/typeorm-history';
import { EventSubscriber } from 'typeorm';
import { Organization } from '../entities';
import { OrganizationHistory } from '../entities/organization-history.entity';

@EventSubscriber()
export class OrganizationHistorySubscriber extends HistoryEntitySubscriber<
  Organization,
  OrganizationHistory
> {
  get entity() {
    return Organization;
  }
  get historyEntity() {
    return OrganizationHistory;
  }
}
