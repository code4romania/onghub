import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { formatDate } from '../../../common/helpers/format.helper';
import { IApplicationRequest } from '../../requests/interfaces/Request.interface';

export const ApplicationRequestsTableHeaders: TableColumn<IApplicationRequest>[] = [
  {
    id: 'name',
    name: 'Aplicatie',
    grow: 3,
    selector: (row: IApplicationRequest) => row.ongApplication?.application.name || '',
  },
  {
    id: 'ong',
    name: 'Organizatie',
    grow: 2,
    selector: (row: IApplicationRequest) => row.organization?.organizationGeneral?.name || '',
  },
  {
    id: 'created_on',
    name: 'Data solicitarii',
    selector: (row: IApplicationRequest) => formatDate(row.createdOn as string),
  },
];
