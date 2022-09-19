import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { formatDate } from '../../../../../common/helpers/format.helper';
import { IUser } from '../../../interfaces/User.interface';
import i18n from '../../../../../common/config/i18n';

const translations = {
  name: i18n.t('user:invites_header.name'),
  email: i18n.t('user:invites_header.email'),
  phone: i18n.t('user:invites_header.phone'),
  added_on: i18n.t('user:invites_header.added_on'),
};

export const UserInvitesTableHeaders: TableColumn<IUser>[] = [
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
    id: 'createdOn',
    name: translations.added_on,
    sortable: true,
    selector: (row: IUser) => formatDate(row?.createdOn as string),
  },
];
