import { HistoryEntitySubscriber } from '@anchan828/typeorm-history';
import { EventSubscriber } from 'typeorm';
import { ApplicationRequestHistory } from '../entities/application-request-history.entity';
import { ApplicationRequest } from '../entities/application-request.entity';

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
