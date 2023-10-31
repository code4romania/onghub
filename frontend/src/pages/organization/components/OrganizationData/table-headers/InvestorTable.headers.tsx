import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { formatDate } from '../../../../../common/helpers/format.helper';
import StatusBadge, { BadgeStatus } from '../../../../../components/status-badge/StatusBadge';
import { CompletionStatus } from '../../../enums/CompletionStatus.enum';
import { Investor } from '../../../interfaces/Investor.interface';
import i18n from '../../../../../common/config/i18n';
import DataTableNameHeader from '../../../../../components/data-table-name-header/DataTableNameHeader';

const translations = {
  list: i18n.t('open_data:investors.list'),
  title: i18n.t('open_data:investors.title'),
  year: i18n.t('common:year'),
  count: i18n.t('open_data:investors.count'),
  status: i18n.t('common:status'),
  update: i18n.t('common:updated_on'),
  completed: i18n.t('common:completion_status.completed'),
  not_completed: i18n.t('common:completion_status.not_completed'),
};

export const InvestorsTableHeaders: TableColumn<Investor>[] = [
  {
    id: 'name',
    name: <DataTableNameHeader text={translations.list} />,
    selector: (row: Investor) => `${translations.title} ${row.year}`,
    grow: 4,
  },
  {
    id: 'year',
    name: <DataTableNameHeader text={translations.year} />,
    selector: (row: Investor) => row.year,
    grow: 1,
    sortable: true,
  },
  {
    id: 'numberOfInvestors',
    name: <DataTableNameHeader text={translations.count} />,
    selector: (row: Investor) => row.numberOfInvestors || 'N/A',
    grow: 2,
    minWidth: '10rem',
    sortable: true,
  },
  {
    id: 'status',
    name: <DataTableNameHeader text={translations.status} />,
    cell: (row: Investor) => (
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
    grow: 1.5,
    minWidth: '10rem',
    allowOverflow: true,
  },
  {
    id: 'updatedOn',
    name: <DataTableNameHeader text={translations.update} />,
    selector: (row: Investor) => formatDate(row?.updatedOn as string),
    sortable: true,
    minWidth: '10rem',
    grow: 1,
  },
];
