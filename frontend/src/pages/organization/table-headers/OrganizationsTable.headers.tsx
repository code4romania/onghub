import React from 'react';
import { TableColumn } from 'react-data-table-component';
import i18n from '../../../common/config/i18n';
import { formatDate } from '../../../common/helpers/format.helper';
import NameWithLogo from '../../../components/name-with-logo/NameWithLogo';
import StatusBadge, { BadgeStatus } from '../../../components/status-badge/StatusBadge';
import { CompletionStatus } from '../enums/CompletionStatus.enum';
import { OrganizationStatus } from '../enums/OrganizationStatus.enum';
import { IOrganizationView } from '../interfaces/Organization.interface';
import DataTableNameHeader from '../../../components/data-table-name-header/DataTableNameHeader';

const translations = {
  ong: i18n.t('organizations:header.ong_alias'),
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
    id: 'alias',
    name: <DataTableNameHeader text={translations.ong} />,
    sortable: true,
    minWidth: '10rem',
    grow: 1.5,
    cell: (row: IOrganizationView) => <NameWithLogo name={row.alias} logo={row.logo} />,
  },
  {
    id: 'userCount',
    name: <DataTableNameHeader text={translations.users} />,
    sortable: true,
    minWidth: '3rem',
    selector: (row: IOrganizationView) => row.userCount,
  },
  {
    id: 'createdOn',
    name: <DataTableNameHeader text={translations.register} />,
    sortable: true,
    minWidth: '10rem',
    selector: (row: IOrganizationView) => formatDate(row.createdOn as string),
  },
  {
    id: 'status',
    sortable: true,
    sortField: 'status',
    name: <DataTableNameHeader text={translations.access} />,
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
    name: <DataTableNameHeader text={translations.updated_on} />,
    sortable: true,
    minWidth: '12rem',
    selector: (row: IOrganizationView) => formatDate(row?.updatedOn as string),
  },
  {
    id: 'completionStatus',
    sortable: true,
    name: <DataTableNameHeader text={translations.status} />,
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
