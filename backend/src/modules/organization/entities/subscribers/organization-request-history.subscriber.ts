import { HistoryEntitySubscriber } from '@anchan828/typeorm-history';
import { EventSubscriber } from 'typeorm';
import { OrganizationRequestHistory } from '../organization-request-history.entity';
import { OrganizationRequest } from '../organization-request.entity';

@EventSubscriber()
export class OrganizationRequestHistorySubscriber extends HistoryEntitySubscriber<
  OrganizationRequest,
  OrganizationRequestHistory
> {
  get entity() {
    return OrganizationRequest;
  }
  get historyEntity() {
    return OrganizationRequestHistory;
  }
}
