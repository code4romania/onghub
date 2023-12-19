import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { formatDate } from '../../../../../common/helpers/format.helper';
import StatusBadge, { BadgeStatus } from '../../../../../components/status-badge/StatusBadge';
import { CompletionStatus } from '../../../enums/CompletionStatus.enum';
import { Report } from '../../../interfaces/Report.interface';
import { ExternalLinkIcon } from '@heroicons/react/solid';

import i18n from '../../../../../common/config/i18n';
import DataTableNameHeader from '../../../../../components/data-table-name-header/DataTableNameHeader';

const translations = {
  year: i18n.t('common:year'),
  volunteers: i18n.t('open_data:report.volunteers'),
  contractors: i18n.t('open_data:report.contractors'),
  activity: i18n.t('open_data:report.activity'),
  status: i18n.t('common:status'),
  update: i18n.t('common:updated_on'),
  not_available: i18n.t('open_data:report.not_available'),
  report: i18n.t('open_data:report.report'),
  completed: i18n.t('common:completion_status.completed'),
  not_completed: i18n.t('common:completion_status.not_completed'),
};

export const ReportsTableHeaders: TableColumn<Report>[] = [
  {
    id: 'year',
    name: <DataTableNameHeader text={translations.year} />,
    selector: (row: Report) => row.year,
    grow: 0,
    minWidth: '6rem',
    sortable: true,
  },
  {
    id: 'numberOfVolunteers',
    name: <DataTableNameHeader text={translations.volunteers} />,
    selector: (row: Report) => row.numberOfVolunteers ?? 'N/A',
    grow: 0.2,
    minWidth: '8rem',
    sortable: true,
  },
  {
    id: 'numberOfContractors',
    name: <DataTableNameHeader text={translations.contractors} />,
    selector: (row: Report) => row.numberOfContractors ?? 'N/A',
    grow: 0.2,
    minWidth: '8rem',
    sortable: true,
  },
  {
    id: 'report',
    name: <DataTableNameHeader text={translations.activity} />,
    cell: (row: Report) =>
      row.report ? (
        <a
          aria-label={`${translations.report}${row.year}`}
          className="text-indigo-600 font-bold text-sm cursor-pointer flex underline decoration-solid"
          href={row.report || ''}
          target="_blank"
          rel="noreferrer"
        >
          {`${translations.report}${row.year}`}
          <ExternalLinkIcon className="w-4 h-4" />
        </a>
      ) : (
        translations.not_available
      ),
    grow: 1,
    sortable: true,
  },
  {
    id: 'status',
    name: <DataTableNameHeader text={translations.status} />,
    cell: (row: Report) => (
      <StatusBadge
        status={
          row.status === CompletionStatus.COMPLETED ? BadgeStatus.SUCCESS : BadgeStatus.WARNING
        }
        value={
          row.status === CompletionStatus.COMPLETED
            ? translations.completed
            : translations.not_completed
        }
      />
    ),
    sortable: true,
    grow: 0,
    minWidth: '10rem',
    allowOverflow: true,
  },
  {
    id: 'updatedOn',
    name: <DataTableNameHeader text={translations.update} />,
    selector: (row: Report) => formatDate(row?.updatedOn as string),
    sortable: true,
    minWidth: '8rem',
    grow: 0.5,
  },
];
