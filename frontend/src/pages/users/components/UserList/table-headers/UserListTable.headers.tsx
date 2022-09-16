import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { formatDate } from '../../../../../common/helpers/format.helper';
import StatusBadge, { BadgeStatus } from '../../../../../components/status-badge/StatusBadge';
import { IUser } from '../../../interfaces/User.interface';
import { UserStatus } from '../../../enums/UserStatus.enum';
import i18n from '../../../../../common/config/i18n';

const translations = {
  name: i18n.t('user:list_header.name'),
  email: i18n.t('user:list_header.email'),
  phone: i18n.t('user:list_header.phone'),
  status: i18n.t('user:list_header.status'),
  created: i18n.t('user:list_header.created'),
  active: i18n.t('user:status.active'),
  restricted: i18n.t('user:status.restricted'),
};

export const UserListTableHeaders: TableColumn<IUser>[] = [
  {
    id: 'name',
    name: translations.name,
    sortable: true,
    selector: (row: IUser) => row.name,
  },
  {
    id: 'email',
    name: translations.email,
    sortable: true,
    selector: (row: IUser) => row.email,
  },
  {
    id: 'phone',
    name: translations.phone,
    sortable: true,
    selector: (row: IUser) => row.phone,
  },
  {
    id: 'status',
    sortable: true,
    sortField: 'status',
    name: translations.status,
    cell: (row: IUser) => (
      <StatusBadge
        status={row.status === UserStatus.ACTIVE ? BadgeStatus.SUCCESS : BadgeStatus.ERROR}
        value={row.status === UserStatus.ACTIVE ? translations.active : translations.restricted}
      />
    ),
  },
  {
    id: 'createdOn',
    name: translations.created,
    sortable: true,
    selector: (row: IUser) => formatDate(row?.createdOn as string),
  },
];
