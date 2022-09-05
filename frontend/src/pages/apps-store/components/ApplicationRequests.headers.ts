import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { formatDate } from '../../../common/helpers/format.helper';
import { IRequest } from '../../requests/interfaces/Request.interface';

export const ApplicationRequestsTableHeaders: TableColumn<IRequest>[] = [
  {
    id: 'name',
    name: 'Aplicatie',
    grow: 4,
    selector: (row: IRequest) => row.ongApplication?.application.name || '',
  },
  {
    id: 'ong',
    name: 'Organizatie',
    selector: (row: IRequest) => row.organization?.organizationGeneral.name || '',
  },
  {
    id: 'created_on',
    name: 'Data solicitarii',
    selector: (row: IRequest) => formatDate(row.createdOn as string),
  },
];
