import { HistoryEntitySubscriber } from '@anchan828/typeorm-history';
import { EventSubscriber } from 'typeorm';
import { ApplicationRequestHistory } from '../application-request-history.entity';
import { ApplicationRequest } from '../application-request.entity';

@EventSubscriber()
export class ApplicationRequestHistorySubscriber extends HistoryEntitySubscriber<
  ApplicationRequest,
  ApplicationRequestHistory
> {
  get entity() {
    return ApplicationRequest;
  }
  get historyEntity() {
    return ApplicationRequestHistory;
  }
}
