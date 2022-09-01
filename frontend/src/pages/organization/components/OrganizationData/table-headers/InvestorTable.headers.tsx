import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { formatDate } from '../../../../../common/helpers/format.helper';
import StatusBadge, { BadgeStatus } from '../../../../../components/status-badge/StatusBadge';
import { CompletionStatus } from '../../../enums/CompletionStatus.enum';
import { Investor } from '../../../interfaces/Investor.interface';

export const InvestorsTableHeaders: TableColumn<Investor>[] = [
  {
    id: 'name',
    name: 'Lista finantatori',
    selector: (row: Investor) => `Finantatori ${row.year}`,
    grow: 4,
  },
  {
    id: 'year',
    name: 'An',
    selector: (row: Investor) => row.year,
    grow: 1,
    sortable: true,
  },
  {
    id: 'numberOfInvestors',
    name: 'Numar finantatori',
    selector: (row: Investor) => row.numberOfInvestors || 'N/A',
    grow: 1.5,
    sortable: true,
  },
  {
    id: 'status',
    name: 'Status',
    cell: (row: Investor) => (
      <StatusBadge
        status={
          row.status === CompletionStatus.COMPLETED ? BadgeStatus.SUCCESS : BadgeStatus.WARNING
        }
        value={row.status === CompletionStatus.COMPLETED ? 'completed' : 'notCompleted'}
      />
    ),
    sortable: true,
    grow: 1.5,
    allowOverflow: true,
  },
  {
    id: 'updatedOn',
    name: 'Ultima actualizare',
    selector: (row: Investor) => formatDate(row?.updatedOn as string),
    sortable: true,
    grow: 1,
  },
];
