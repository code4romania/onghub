import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { IOrganizationFinancial } from '../../interfaces/OrganizationFinancial.interface';
import { formatCurrency, formatDate } from '../../../../common/helpers/format.helper';
import StatusBadge, { BadgeStatus } from '../../../../components/status-badge/StatusBadge';
import { FinancialType } from '../../enums/FinancialType.enum';
import { OrganizationFinancialReportStatus } from '../../enums/CompletionStatus.enum';
import i18n from '../../../../common/config/i18n';
import DataTableNameHeader from '../../../../components/data-table-name-header/DataTableNameHeader';

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
  not_completed: i18n.t('common:completion_status.not_completed'),
  invalid: i18n.t('common:completion_status.invalid'),
  pending: i18n.t('common:completion_status.pending'),
  tooltip: {
    completed: i18n.t('financial:tooltip.completed'),
    not_completed: i18n.t('financial:tooltip.not_completed'),
    pending: i18n.t('financial:tooltip.pending'),
    invalid: i18n.t('financial:tooltip.invalid'),
    error: i18n.t('financial:tooltip.error'),
  },
};

const mapReportStatusToTextAndBadge = (status: OrganizationFinancialReportStatus) => {
  switch (status) {
    case OrganizationFinancialReportStatus.COMPLETED:
      return {
        translation: translations.completed,
        badge: BadgeStatus.SUCCESS,
        tooltipContent: translations.tooltip.completed,
      };
    case OrganizationFinancialReportStatus.INVALID:
      return {
        translation: translations.invalid,
        badge: BadgeStatus.ERROR,
        tooltipContent: translations.tooltip.invalid,
      };
    case OrganizationFinancialReportStatus.NOT_COMPLETED:
      return {
        translation: translations.not_completed,
        badge: BadgeStatus.WARNING,
        tooltipContent: translations.tooltip.not_completed,
      };
    case OrganizationFinancialReportStatus.PENDING:
      return {
        translation: translations.pending,
        badge: BadgeStatus.WARNING,
        tooltipContent: translations.tooltip.pending,
      };
    default:
      return {
        translation: 'Error',
        badge: BadgeStatus.ERROR,
        tooltipContent: translations.tooltip.error,
      };
  }
};

export const OrganizationFinancialTableHeaders: TableColumn<IOrganizationFinancial>[] = [
  {
    id: 'reportName',
    name: <DataTableNameHeader text={translations.report} />,
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
    name: <DataTableNameHeader text={translations.year} />,
    selector: (row: IOrganizationFinancial) => row.year,
    sortable: true,
    grow: 0,
  },
  {
    id: 'numberOfEmployees',
    name: <DataTableNameHeader text={translations.employees} />,
    selector: (row: IOrganizationFinancial) => row.numberOfEmployees,
    sortable: true,
    minWidth: '8rem',
    grow: 0,
  },
  {
    id: 'total',
    name: <DataTableNameHeader text={translations.sum} />,
    selector: (row: IOrganizationFinancial) => formatCurrency(row?.total),
    sortable: true,
    minWidth: '7rem',
    grow: 0,
  },
  {
    id: 'updatedOn',
    name: <DataTableNameHeader text={translations.updated} />,
    selector: (row: IOrganizationFinancial) => formatDate(row?.updatedOn as string),
    sortable: true,
    minWidth: '10rem',
    grow: 1,
  },
  {
    id: 'status',
    name: <DataTableNameHeader text={translations.status} />,
    cell: (row: IOrganizationFinancial) => (
      <StatusBadge
        status={mapReportStatusToTextAndBadge(row.reportStatus).badge}
        value={mapReportStatusToTextAndBadge(row.reportStatus).translation}
        tooltip
        tooltipContent={mapReportStatusToTextAndBadge(row.reportStatus).tooltipContent}
      />
    ),
    sortable: true,
    grow: 0,
    minWidth: '10rem',
    allowOverflow: true,
  },
];
