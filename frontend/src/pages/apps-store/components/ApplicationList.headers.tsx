import React from 'react';
import { TableColumn } from 'react-data-table-component';
import NameWithLogo from '../../../components/name-with-logo/NameWithLogo';
import StatusBadge from '../../../components/status-badge/StatusBadge';
import { Application } from '../../../services/application/interfaces/Application.interface';
import {
  ApplicationStatusBadgeMapper,
  APPLICATION_STATUS_NAME,
} from '../constants/ApplicationStatus.constant';
import { ApplicationTypeNaming } from '../constants/ApplicationType.enum';

export const ApplicationtListTableHeaders: TableColumn<Application>[] = [
  {
    id: 'name',
    name: 'Aplicatie',
    sortable: true,
    sortField: 'name',
    grow: 3,
    cell: (row: Application) => <NameWithLogo logo={row.logo} name={row.name} />,
  },
  {
    id: 'organizationCount',
    sortable: true,
    name: 'Numar ONGuri',
    grow: 1,
    selector: (row: Application) => row.organizationCount,
  },
  {
    id: 'userCount',
    sortable: true,
    name: 'Utilizatori',
    grow: 1,
    selector: (row: Application) => row.userCount,
  },
  {
    id: 'type',
    sortable: false,
    name: 'Tip aplicatie',
    grow: 2,
    selector: (row: Application) => ApplicationTypeNaming[row.type],
  },
  {
    id: 'status',
    sortable: true,
    sortField: 'status',
    name: 'Status',
    cell: (row: Application) => (
      <StatusBadge
        status={ApplicationStatusBadgeMapper(row.status)}
        value={APPLICATION_STATUS_NAME[row.status]}
      />
    ),
  },
];
