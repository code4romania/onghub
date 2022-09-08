import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { formatDate } from '../../../common/helpers/format.helper';
import StatusBadge from '../../../components/status-badge/StatusBadge';
import {
  RequestStatusBadgeMapper,
  REQUEST_STATUS_NAME,
} from '../constants/RequestStatus.constants';
import { IOrganizationRequest } from '../interfaces/Request.interface';

export const RequestListTableHeaders: TableColumn<IOrganizationRequest>[] = [
  {
    id: 'organizationName',
    name: 'Organizatie',
    sortable: true,
    selector: (row: IOrganizationRequest) => row.organizationName,
    grow: 3,
  },
  {
    id: 'name',
    name: 'Nume',
    sortable: false,
    selector: (row: IOrganizationRequest) => row.name,
  },
  {
    id: 'email',
    name: 'Email',
    sortable: false,
    selector: (row: IOrganizationRequest) => row.email,
  },
  {
    id: 'phone',
    name: 'Telefon',
    sortable: false,
    selector: (row: IOrganizationRequest) => row.phone,
  },
  {
    id: 'status',
    sortable: true,
    sortField: 'status',
    name: 'Status',
    cell: (row: IOrganizationRequest) => (
      <StatusBadge
        status={RequestStatusBadgeMapper(row.status)}
        value={REQUEST_STATUS_NAME[row.status] || 'Status errorr'}
      />
    ),
  },
  {
    id: 'createdOn',
    name: 'Data adaugarii',
    sortable: true,
    selector: (row: IOrganizationRequest) => formatDate(row?.createdOn as string),
  },
];
