import React from 'react';
import { TableColumn } from 'react-data-table-component';
import i18n from '../../../common/config/i18n';
import { formatDate } from '../../../common/helpers/format.helper';
import NameWithLogo from '../../../components/name-with-logo/NameWithLogo';
import StatusBadge, { BadgeStatus } from '../../../components/status-badge/StatusBadge';
import { CompletionStatus } from '../enums/CompletionStatus.enum';
import { OrganizationStatus } from '../enums/OrganizationStatus.enum';
import { IOrganizationView } from '../interfaces/Organization.interface';

const translations = {
  ong: i18n.t('organizations:header.ong'),
  users: i18n.t('organizations:header.users'),
  register: i18n.t('organizations:header.register'),
  access: i18n.t('organizations:header.access'),
  updated_on: i18n.t('organizations:header.updated'),
  status: i18n.t('organizations:header.status'),
  incomplete: i18n.t('organization:filters.incomplete'),
  updated: i18n.t('organization:filters.updated'),
  active: i18n.t('organizations:header.active'),
  restricted: i18n.t('organizations:header.restricted'),
};

export const OrganizationsTableHeaders: TableColumn<IOrganizationView>[] = [
  {
    id: 'name',
    name: translations.ong,
    sortable: true,
    minWidth: '15rem',
    grow: 2,
    cell: (row: IOrganizationView) => <NameWithLogo name={row.name} logo={row.logo} />,
  },
  {
    id: 'userCount',
    name: translations.users,
    sortable: true,
    grow: 1,
    selector: (row: IOrganizationView) => row.userCount,
  },
  {
    id: 'createdOn',
    name: translations.register,
    sortable: true,
    grow: 1,
    minWidth: '10rem',
    selector: (row: IOrganizationView) => formatDate(row.createdOn as string),
  },
  {
    id: 'status',
    sortable: true,
    sortField: 'status',
    name: translations.access,
    grow: 1,
    minWidth: '10rem',
    cell: (row: IOrganizationView) => (
      <StatusBadge
        status={row.status === OrganizationStatus.ACTIVE ? BadgeStatus.SUCCESS : BadgeStatus.ERROR}
        value={
          row.status === OrganizationStatus.ACTIVE ? translations.active : translations.restricted
        }
      />
    ),
  },
  {
    id: 'updatedOn',
    name: translations.updated_on,
    sortable: true,
    grow: 1,
    minWidth: '15rem',
    selector: (row: IOrganizationView) => formatDate(row?.updatedOn as string),
  },
  {
    id: 'completionStatus',
    sortable: true,
    name: translations.status,
    grow: 1,
    minWidth: '15rem',
    cell: (row: IOrganizationView) => (
      <StatusBadge
        status={
          row.completionStatus === CompletionStatus.NOT_COMPLETED
            ? BadgeStatus.WARNING
            : BadgeStatus.SUCCESS
        }
        value={
          row.completionStatus === CompletionStatus.NOT_COMPLETED
            ? translations.incomplete
            : translations.updated
        }
      />
    ),
  },
];
