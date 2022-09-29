import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { formatDate } from '../../../../../common/helpers/format.helper';
import i18n from '../../../../../common/config/i18n';
import { IInvite } from '../../../interfaces/Invite.interface';

const translations = {
  name: i18n.t('user:invites_header.name'),
  email: i18n.t('user:invites_header.email'),
  phone: i18n.t('user:invites_header.phone'),
  added_on: i18n.t('user:invites_header.added_on'),
};

export const UserInvitesTableHeaders: TableColumn<IInvite>[] = [
  {
    id: 'name',
    name: translations.name,
    sortable: true,
    selector: (row: IInvite) => row.name,
  },
  {
    id: 'email',
    name: translations.email,
    sortable: true,
    selector: (row: IInvite) => row.email,
  },
  {
    id: 'phone',
    name: translations.phone,
    sortable: true,
    selector: (row: IInvite) => row.phone,
  },
  {
    id: 'createdOn',
    name: translations.added_on,
    sortable: true,
    selector: (row: IInvite) => formatDate(row?.createdOn),
  },
];
