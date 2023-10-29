import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { formatDate } from '../../../../../common/helpers/format.helper';
import StatusBadge, { BadgeStatus } from '../../../../../components/status-badge/StatusBadge';
import { CompletionStatus } from '../../../enums/CompletionStatus.enum';
import { Partner } from '../../../interfaces/Partner.interface';
import i18n from '../../../../../common/config/i18n';

const translations = {
  list: i18n.t('open_data:partners.list'),
  year: i18n.t('common:year'),
  count: i18n.t('open_data:partners.count'),
  title: i18n.t('open_data:partners.title'),
  status: i18n.t('common:status'),
  update: i18n.t('common:updated_on'),
  completed: i18n.t('common:completion_status.completed'),
  not_completed: i18n.t('common:completion_status.not_completed'),
};

export const PartnerTableHeaders: TableColumn<Partner>[] = [
  {
    id: 'name',
    name: translations.list,
    selector: (row: Partner) => `${translations.title} ${row.year}`,
    grow: 4,
  },
  {
    id: 'year',
    name: translations.year,
    selector: (row: Partner) => row.year,
    grow: 1,
    sortable: true,
  },
  {
    id: 'numberOfPartners',
    name: translations.count,
    selector: (row: Partner) => row.numberOfPartners || 'N/A',
    grow: 2,
    minWidth: '10rem',
    sortable: true,
  },
  {
    id: 'status',
    name: translations.status,
    cell: (row: Partner) => (
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
    name: translations.update,
    selector: (row: Partner) => formatDate(row?.updatedOn as string),
    sortable: true,
    minWidth: '10rem',
    grow: 1,
  },
];
