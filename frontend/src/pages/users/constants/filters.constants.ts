import { UserStatus } from '../enums/UserStatus.enum';

export const UserStatusOptions = [
  {
    status: UserStatus.ACTIVE,
    label: 'Activ',
  },
  {
    status: UserStatus.PENDING,
    label: 'In asteptare',
  },
  {
    status: UserStatus.RESTRICTED,
    label: 'Restrictionat',
  },
];
