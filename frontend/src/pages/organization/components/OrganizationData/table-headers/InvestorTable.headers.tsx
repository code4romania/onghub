import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { formatDate } from '../../../../../common/helpers/format.helper';
import StatusBadge, { BadgeStatus } from '../../../../../components/status-badge/StatusBadge';
import { CompletionStatus } from '../../../enums/CompletionStatus.enum';
import { Investor } from '../../../interfaces/Investor.interface';
import i18n from '../../../../../common/config/i18n';

const translations = {
  list: i18n.t('open_data:investors.list'),
  title: i18n.t('open_data:investors.title'),
  year: i18n.t('common:year'),
  count: i18n.t('open_data:investors.count'),
  status: i18n.t('common:status'),
  update: i18n.t('common:updated_on'),
  completed: i18n.t('common:completion_status.completed'),
  incompleted: i18n.t('common:completion_status.incompleted'),
};

export const InvestorsTableHeaders: TableColumn<Investor>[] = [
  {
    id: 'name',
    name: translations.list,
    selector: (row: Investor) => `${translations.title} ${row.year}`,
    grow: 4,
  },
  {
    id: 'year',
    name: translations.year,
    selector: (row: Investor) => row.year,
    grow: 1,
    sortable: true,
  },
  {
    id: 'numberOfInvestors',
    name: translations.count,
    selector: (row: Investor) => row.numberOfInvestors || 'N/A',
    grow: 1.5,
    sortable: true,
  },
  {
    id: 'status',
    name: translations.status,
    cell: (row: Investor) => (
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
    selector: (row: Investor) => formatDate(row?.updatedOn as string),
    sortable: true,
    grow: 1,
  },
];
