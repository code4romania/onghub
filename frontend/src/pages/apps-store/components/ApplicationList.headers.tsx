import React from 'react';
import { TableColumn } from 'react-data-table-component';
import NameWithLogo from '../../../components/name-with-logo/NameWithLogo';
import StatusBadge from '../../../components/status-badge/StatusBadge';
import { Application } from '../../../services/application/interfaces/Application.interface';
import {
  ApplicationStatusBadgeMapper,
  APPLICATION_STATUS_NAME,
} from '../constants/ApplicationStatus.constant';
import { ApplicationTypeEnum, ApplicationTypeNaming } from '../constants/ApplicationType.enum';
import i18n from '../../../common/config/i18n';
import DataTableNameHeader from '../../../components/data-table-name-header/DataTableNameHeader';

const translations = {
  name: i18n.t('appstore:header.name'),
  type: i18n.t('appstore:header.type'),
  status: i18n.t('appstore:header.status'),
  ong_number: i18n.t('appstore:header.ong_number'),
  users: i18n.t('appstore:header.users'),
};

export const ApplicationtListTableHeaders: TableColumn<Application>[] = [
  {
    id: 'name',
    name: <DataTableNameHeader text={translations.name} />,
    sortable: true,
    sortField: 'name',
    grow: 3,
    minWidth: '15rem',
    cell: (row: Application) => <NameWithLogo logo={row.logo} name={row.name} />,
  },
  {
    id: 'organizationCount',
    sortable: true,
    name: <DataTableNameHeader text={translations.ong_number} />,
    grow: 1,
    minWidth: '10rem',
    selector: (row: Application) =>
      row.type === ApplicationTypeEnum.INDEPENDENT ? '-' : row.organizationCount,
  },
  {
    id: 'userCount',
    sortable: true,
    name: <DataTableNameHeader text={translations.users} />,
    grow: 1,
    selector: (row: Application) =>
      row.type === ApplicationTypeEnum.INDEPENDENT ? '-' : row.userCount,
  },
  {
    id: 'type',
    sortable: false,
    name: <DataTableNameHeader text={translations.type} />,
    grow: 2,
    minWidth: '15rem',
    selector: (row: Application) => ApplicationTypeNaming[row.type],
  },
  {
    id: 'status',
    sortable: true,
    sortField: 'status',
    name: <DataTableNameHeader text={translations.status} />,
    minWidth: '7rem',
    cell: (row: Application) => (
      <StatusBadge
        status={ApplicationStatusBadgeMapper(row.status)}
        value={APPLICATION_STATUS_NAME[row.status]}
      />
    ),
  },
];
