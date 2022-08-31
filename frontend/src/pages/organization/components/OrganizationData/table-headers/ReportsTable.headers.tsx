import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { formatDate } from '../../../../../common/helpers/format.helper';
import StatusBadge, { BadgeStatus } from '../../../../../components/status-badge/StatusBadge';
import { CompletionStatus } from '../../../enums/CompletionStatus.enum';
import { Report } from '../../../interfaces/Report.interface';
import { ExternalLinkIcon } from '@heroicons/react/solid';

export const ReportsTableHeaders: TableColumn<Report>[] = [
  {
    id: 'year',
    name: 'An',
    selector: (row: Report) => row.year,
    grow: 1,
    sortable: true,
  },
  {
    id: 'numberOfVolunteers',
    name: 'Voluntari',
    selector: (row: Report) => row.numberOfVolunteers ?? 'N/A',
    grow: 1,
    sortable: true,
  },
  {
    id: 'numberOfContractors',
    name: 'Contractori',
    selector: (row: Report) => row.numberOfContractors ?? 'N/A',
    grow: 1,
    sortable: true,
  },
  {
    id: 'report',
    name: 'Raport Activitate',
    cell: (row: Report) =>
      row.report ? (
        <a
          className="text-indigo-600 font-bold text-sm cursor-pointer flex underline decoration-solid"
          href={row.report || ''}
          target="_blank"
          rel="noreferrer"
        >
          {`Report${row.year}`}
          <ExternalLinkIcon className="w-4 h-4" />
        </a>
      ) : (
        'Nu este disponibil'
      ),
    grow: 4,
    sortable: true,
  },
  {
    id: 'status',
    name: 'Status',
    cell: (row: Report) => (
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
    selector: (row: Report) => formatDate(row?.updatedOn as string),
    sortable: true,
    grow: 1,
  },
];
