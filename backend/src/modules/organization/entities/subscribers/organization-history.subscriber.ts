import { HistoryEntitySubscriber } from '@anchan828/typeorm-history';
import { EventSubscriber } from 'typeorm';
import { OrganizationHistory } from '../organization-history.entity';
import { Organization } from '../organization.entity';

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
