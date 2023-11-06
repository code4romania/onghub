import React from 'react';
import { TableColumn } from 'react-data-table-component';
import i18n from '../../../../common/config/i18n';
import { formatDate } from '../../../../common/helpers/format.helper';
import NameWithLogo from '../../../../components/name-with-logo/NameWithLogo';
import StatusBadge from '../../../../components/status-badge/StatusBadge';
import { ApplicationOrganization } from '../../../../services/application/interfaces/Application.interface';
import {
  OngApplicationStatusBadgeMapper,
  ONG_APPLICATION_STATUS,
} from '../../../apps-store/constants/ApplicationStatus.constant';
import DataTableNameHeader from '../../../../components/data-table-name-header/DataTableNameHeader';

const translations = {
  name: i18n.t('app:list_header.name'),
  userCount: i18n.t('app:list_header.user_count'),
  createdOn: i18n.t('app:list_header.created_on'),
  access: i18n.t('app:list_header.access'),
  active: i18n.t('user:status.active'),
  restricted: i18n.t('user:status.restricted'),
};

export const ApplicationNGOListTableHeaders: TableColumn<ApplicationOrganization>[] = [
  {
    id: 'name',
    name: <DataTableNameHeader text={translations.name} />,
    sortable: true,
    grow: 2,
    minWidth: '15rem',
    cell: (row: ApplicationOrganization) => <NameWithLogo name={row.name} logo={row.logo} />,
  },
  {
    id: 'userCount',
    name: <DataTableNameHeader text={translations.userCount} />,
    sortable: true,
    grow: 1,
    minWidth: '10rem',
    selector: (row: ApplicationOrganization) => row.userCount,
  },
  {
    id: 'createdOn',
    name: <DataTableNameHeader text={translations.createdOn} />,
    sortable: true,
    grow: 1,
    minWidth: '10rem',
    selector: (row: ApplicationOrganization) => formatDate(row.createdOn),
  },
  {
    id: 'status',
    sortable: true,
    sortField: 'status',
    grow: 1,
    minWidth: '10rem',
    name: <DataTableNameHeader text={translations.access} />,
    cell: (row: ApplicationOrganization) => (
      <StatusBadge
        status={OngApplicationStatusBadgeMapper(row.status)}
        value={ONG_APPLICATION_STATUS[row.status] || translations.active} // in case status is null for independent app the status should be active
      />
    ),
  },
];
