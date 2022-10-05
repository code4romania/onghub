import { HistoryEntitySubscriber } from '@anchan828/typeorm-history';
import { EventSubscriber } from 'typeorm';
import { ApplicationHistory } from '../entities/application-history.entity';
import { Application } from '../entities/application.entity';

@EventSubscriber()
export class ApplicationHistorySubscriber extends HistoryEntitySubscriber<
  Application,
  ApplicationHistory
> {
  get entity() {
    return Application;
  }
  get historyEntity() {
    return ApplicationHistory;
  }
}
