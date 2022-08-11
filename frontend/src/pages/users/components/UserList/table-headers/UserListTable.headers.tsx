import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { formatDate } from '../../../../../common/helpers/format.helper';
import StatusBadge, { BadgeStatus } from '../../../../../components/status-badge/StatusBadge';
import { IUser } from '../../../interfaces/User.interface';
import { UserStatus } from '../../../enums/UserStatus.enum';

export const UserListTableHeaders: TableColumn<IUser>[] = [
  {
    id: 'name',
    name: 'Nume',
    sortable: true,
    selector: (row: IUser) => row.name,
  },
  {
    id: 'email',
    name: 'Email',
    sortable: true,
    selector: (row: IUser) => row.email,
  },
  {
    id: 'phone',
    name: 'Telefon',
    sortable: true,
    selector: (row: IUser) => row.phone,
  },
  {
    id: 'status',
    sortable: true,
    sortField: 'status',
    name: 'Access general',
    cell: (row: IUser) => (
      <StatusBadge
        status={row.status === UserStatus.ACTIVE ? BadgeStatus.SUCCESS : BadgeStatus.ERROR}
        value={row.status === UserStatus.ACTIVE ? 'Activ' : 'Restrictionat'}
      />
    ),
  },
  {
    id: 'createdOn',
    name: 'Data adaugarii',
    sortable: true,
    selector: (row: IUser) => formatDate(row?.createdOn as string),
  },
];
