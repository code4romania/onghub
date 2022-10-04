import React from 'react';
import { TableColumn } from 'react-data-table-component';
import i18n from '../../../../../common/config/i18n';
import { formatDate } from '../../../../../common/helpers/format.helper';
import NameWithLogo from '../../../../../components/name-with-logo/NameWithLogo';
import StatusBadge from '../../../../../components/status-badge/StatusBadge';
import { ApplicationWithOngStatus } from '../../../../../services/application/interfaces/Application.interface';
import {
  OngApplicationStatusBadgeMapper,
  ONG_APPLICATION_STATUS,
} from '../../../../apps-store/constants/ApplicationStatus.constant';

const translations = {
  name: i18n.t('appstore:header.name'),
  type: i18n.t('appstore:header.type'),
  status: i18n.t('appstore:header.status'),
  active: i18n.t('appstore:status.active'),
  createdOn: i18n.t('common:created_on'),
};

export const OrganizationApplicationsTableHeaders: TableColumn<ApplicationWithOngStatus>[] = [
  {
    id: 'name',
    name: translations.name,
    sortable: true,
    grow: 6,
    selector: (row) => row.name,
    cell: (row: ApplicationWithOngStatus) => <NameWithLogo logo={row.logo} name={row.name} />,
  },

  {
    id: 'status',
    sortable: false,
    grow: 1,
    name: translations.status,
    cell: (row: ApplicationWithOngStatus) => (
      <StatusBadge
        status={OngApplicationStatusBadgeMapper(row.status)}
        value={ONG_APPLICATION_STATUS[row.status] || translations.active} // in case status is null for independent app the status should be active
      />
    ),
  },
  {
    id: 'createdOn',
    sortable: true,
    name: translations.createdOn,
    grow: 1,
    selector: (row: ApplicationWithOngStatus) => formatDate(row.createdOn),
  },
];
