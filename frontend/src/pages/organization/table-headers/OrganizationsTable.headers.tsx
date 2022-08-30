import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { formatDate } from '../../../common/helpers/format.helper';
import StatusBadge, { BadgeStatus } from '../../../components/status-badge/StatusBadge';
import { OrganizationStatus } from '../enums/OrganizationStatus.enum';
import { IOrganizationView } from '../interfaces/Organization.interface';

export const OrganizationsTableHeaders: TableColumn<IOrganizationView>[] = [
  {
    id: 'name',
    name: 'ONG',
    sortable: true,
    selector: (row: IOrganizationView) => row.name,
  },
  {
    id: 'userCount',
    name: 'Utilizatori',
    sortable: true,
    selector: (row: IOrganizationView) => row.userCount,
  },
  {
    id: 'createdOn',
    name: 'Inregistrare',
    sortable: true,
    selector: (row: IOrganizationView) => formatDate(row.createdOn as string),
  },
  {
    id: 'status',
    sortable: true,
    sortField: 'status',
    name: 'Access',
    cell: (row: IOrganizationView) => (
      <StatusBadge
        status={row.status === OrganizationStatus.ACTIVE ? BadgeStatus.SUCCESS : BadgeStatus.ERROR}
        value={row.status === OrganizationStatus.ACTIVE ? 'Activ' : 'Restrictionat'}
      />
    ),
  },
  {
    id: 'updatedOn',
    name: 'Ultima actualizare date',
    sortable: true,
    selector: (row: IOrganizationView) => formatDate(row?.updatedOn as string),
  },
  {
    id: 'completionStatusCount',
    sortable: true,
    name: 'Status Actualizare',
    cell: (row: IOrganizationView) => (
      <StatusBadge
        status={+row.completionStatusCount > 0 ? BadgeStatus.WARNING : BadgeStatus.SUCCESS}
        value={+row.completionStatusCount > 0 ? 'Incomplet' : 'Actualizat'}
      />
    ),
  },
];
