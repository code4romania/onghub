import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { IOrganizationFinancial } from '../../interfaces/OrganizationFinancial.interface';
import { formatCurrency, formatDate } from '../../../../common/helpers/format.helper';
import StatusBadge, { BadgeStatus } from '../../../../components/status-badge/StatusBadge';
import { FinancialType } from '../../enums/FinancialType.enum';
import { CompletionStatus } from '../../enums/CompletionStatus.enum';
import i18n from '../../../../common/config/i18n';

const translations = {
  report: i18n.t('financial:header.report'),
  income: i18n.t('financial:header.income'),
  expense: i18n.t('financial:header.expense'),
  employees: i18n.t('financial:header.employees'),
  year: i18n.t('common:year'),
  updated: i18n.t('common:updated_on'),
  status: i18n.t('common:status'),
  sum: i18n.t('financial:modal.sum'),
  completed: i18n.t('common:completion_status.completed'),
  incompleted: i18n.t('common:completion_status.incompleted'),
};

export const OrganizationFinancialTableHeaders: TableColumn<IOrganizationFinancial>[] = [
  {
    id: 'reportName',
    name: translations.report,
    cell: (row: IOrganizationFinancial) => (
      <span>
        {row.type === FinancialType.INCOME ? translations.income : translations.expense}
        {` ${row.year}`}
      </span>
    ),
    grow: 4,
  },
  {
    id: 'year',
    name: translations.year,
    selector: (row: IOrganizationFinancial) => row.year,
    sortable: true,
    grow: 0.5,
  },
  {
    id: 'numberOfEmployees',
    name: translations.employees,
    selector: (row: IOrganizationFinancial) => row.numberOfEmployees,
    sortable: true,
    grow: 0.6,
  },
  {
    id: 'total',
    name: translations.sum,
    selector: (row: IOrganizationFinancial) => formatCurrency(row?.total),
    sortable: true,
    minWidth: '10rem',
    grow: 0.5,
  },
  {
    id: 'updatedOn',
    name: translations.updated,
    selector: (row: IOrganizationFinancial) => formatDate(row?.updatedOn as string),
    sortable: true,
    minWidth: '10rem',
    grow: 1,
  },
  {
    id: 'status',
    name: translations.status,
    cell: (row: IOrganizationFinancial) => (
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
    minWidth: '10rem',
    allowOverflow: true,
  },
];
