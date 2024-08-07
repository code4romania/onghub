import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { formatDate } from '../../../../../common/helpers/format.helper';
import i18n from '../../../../../common/config/i18n';
import { IInvite } from '../../../interfaces/Invite.interface';
import DataTableNameHeader from '../../../../../components/data-table-name-header/DataTableNameHeader';

const translations = {
  name: i18n.t('user:invites_header.name'),
  email: i18n.t('user:invites_header.email'),
  phone: i18n.t('user:invites_header.phone'),
  added_on: i18n.t('user:invites_header.added_on'),
  organizationAlias: i18n.t('user:invites_header.organizationAlias'),
  role: i18n.t('user:invites_header.role'),
};

export const UserInvitesTableHeaders: TableColumn<IInvite>[] = [
  {
    id: 'name',
    name: <DataTableNameHeader text={translations.name} />,
    sortable: true,
    minWidth: '10rem',
    selector: (row: IInvite) => row.name,
  },
  {
    id: 'email',
    name: <DataTableNameHeader text={translations.email} />,
    sortable: true,
    minWidth: '15rem',
    selector: (row: IInvite) => row.email,
  },
  {
    id: 'phone',
    name: <DataTableNameHeader text={translations.phone} />,
    sortable: true,
    minWidth: '10rem',
    selector: (row: IInvite) => row.phone,
  },
  {
    id: 'createdOn',
    name: <DataTableNameHeader text={translations.added_on} />,
    sortable: true,
    minWidth: '10rem',
    selector: (row: IInvite) => formatDate(row?.createdOn),
  },
];

export const UserInvitesTableHeaderSuperAdmin: TableColumn<IInvite>[] = [
  {
    id: 'organization.organizationGeneral.alias',
    name: <DataTableNameHeader text={translations.organizationAlias} />,
    sortable: true,
    grow: 1,
    wrap: false,
    minWidth: '15rem',
    selector: (row: IInvite) => row.organization.organizationGeneral.alias,
  },
  {
    id: 'role',
    name: <DataTableNameHeader text={translations.role} />,
    sortable: true,
    grow: 1,
    wrap: false,
    minWidth: '10rem',
    selector: (row: IInvite) => row.role,
  },
];
