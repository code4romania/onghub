import { HistoryEntitySubscriber } from '@anchan828/typeorm-history';
import { EventSubscriber } from 'typeorm';
import { OrganizationRequestHistory } from '../entities/organization-request-history.entity';
import { OrganizationRequest } from '../entities/organization-request.entity';

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
