import { HistoryEntitySubscriber } from '@anchan828/typeorm-history';
import { EventSubscriber } from 'typeorm';
import { OngApplicationHistory } from '../ong-application-history.entity';
import { OngApplication } from '../ong-application.entity';

@EventSubscriber()
export class OngApplicationHistorySubscriber extends HistoryEntitySubscriber<
  OngApplication,
  OngApplicationHistory
> {
  get entity() {
    return OngApplication;
  }
  get historyEntity() {
    return OngApplicationHistory;
  }
}
