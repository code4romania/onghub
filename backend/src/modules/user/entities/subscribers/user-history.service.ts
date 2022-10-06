import { HistoryEntitySubscriber } from '@anchan828/typeorm-history';
import { EventSubscriber } from 'typeorm';
import { UserHistory } from '../user-history.entity';
import { User } from '../user.entity';

@EventSubscriber()
export class UserHistorySubscriber extends HistoryEntitySubscriber<
  User,
  UserHistory
> {
  get entity() {
    return User;
  }
  get historyEntity() {
    return UserHistory;
  }
}
