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
  update: i18n.t('common:updatedOn'),
  completed: i18n.t('common:completion_status.completed'),
  incompleted: i18n.t('common:completion_status.incompleted'),
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
    grow: 1.5,
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
    selector: (row: Partner) => formatDate(row?.updatedOn as string),
    sortable: true,
    grow: 1,
  },
];
