import { SetMetadata } from '@nestjs/common';
import { UserStatus } from 'src/modules/user/enums/user-status.enum';

export const ALLOWED_STATUSES = 'allowedStatuses';

export const AllowedStatuses = (...statuses: UserStatus[]) =>
  SetMetadata(ALLOWED_STATUSES, statuses);
