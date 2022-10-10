import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { formatDate } from '../../../../../common/helpers/format.helper';
import StatusBadge, { BadgeStatus } from '../../../../../components/status-badge/StatusBadge';
import { CompletionStatus } from '../../../enums/CompletionStatus.enum';
import { Report } from '../../../interfaces/Report.interface';
import { ExternalLinkIcon } from '@heroicons/react/solid';

import i18n from '../../../../../common/config/i18n';

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
  incompleted: i18n.t('common:completion_status.incompleted'),
};

export const ReportsTableHeaders: TableColumn<Report>[] = [
  {
    id: 'year',
    name: translations.year,
    selector: (row: Report) => row.year,
    grow: 1,
    sortable: true,
  },
  {
    id: 'numberOfVolunteers',
    name: translations.volunteers,
    selector: (row: Report) => row.numberOfVolunteers ?? 'N/A',
    grow: 1,
    sortable: true,
  },
  {
    id: 'numberOfContractors',
    name: translations.contractors,
    selector: (row: Report) => row.numberOfContractors ?? 'N/A',
    grow: 1,
    sortable: true,
  },
  {
    id: 'report',
    name: translations.activity,
    cell: (row: Report) =>
      row.report ? (
        <a
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
    grow: 4,
    sortable: true,
  },
  {
    id: 'status',
    name: translations.status,
    cell: (row: Report) => (
      <StatusBadge
        status={
          row.status === CompletionStatus.COMPLETED ? BadgeStatus.SUCCESS : BadgeStatus.WARNING
        }
        value={
          row.status === CompletionStatus.COMPLETED
            ? translations.completed
            : translations.incompleted
        }
      />
    ),
    sortable: true,
    grow: 1.5,
    allowOverflow: true,
  },
  {
    id: 'updatedOn',
    name: translations.update,
    selector: (row: Report) => formatDate(row?.updatedOn as string),
    sortable: true,
    grow: 1,
  },
];
