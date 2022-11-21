import { OrderDirection } from '../../../common/enums/sort-direction.enum';
import { UserStatus } from '../enums/UserStatus.enum';

export interface IUserDownload {
  orderBy: string | undefined;
  orderDirection: OrderDirection | undefined;
  search: string | null;
  status: UserStatus | undefined | null;
  range: Date[];
  organizationId: number | undefined;
}
