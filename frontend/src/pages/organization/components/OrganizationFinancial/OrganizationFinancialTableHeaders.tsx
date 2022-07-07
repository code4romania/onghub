import React from 'react';
import { Trans } from '@lingui/react';
import { TableColumn } from 'react-data-table-component';
import {
  CompletionStatus,
  FinancialType,
  IOrganizationFinancial,
} from './OrganizationFinancial.interface';
import { formatCurrency, formatDate } from '../../../../common/helpers/format.helper';
import StatusBadge, { BadgeStatus } from '../../../../components/status-badge/StatusBadge';

export const OrganizationFinancialTableHeaders: TableColumn<IOrganizationFinancial>[] = [
  {
    id: 'reportName',
    name: <Trans id="reports" />,
    cell: (row: IOrganizationFinancial) => (
      <span>
        {row.type === FinancialType.INCOME ? <Trans id="income" /> : <Trans id="expense" />}
        {` ${row.year}`}
      </span>
    ),
    grow: 4,
  },
  {
    id: 'year',
    name: <Trans id="year" />,
    selector: (row: IOrganizationFinancial) => row.year,
    sortable: true,
    grow: 0.5,
  },
  {
    id: 'numberOfEmployees',
    name: <Trans id="employees" />,
    selector: (row: IOrganizationFinancial) => row.numberOfEmployees,
    sortable: true,
    grow: 0.6,
  },
  {
    id: 'total',
    name: <Trans id="total" />,
    selector: (row: IOrganizationFinancial) => formatCurrency(row.total),
    sortable: true,
    grow: 0.5,
  },
  {
    id: 'updatedOn',
    name: <Trans id="updateOn" />,
    selector: (row: IOrganizationFinancial) => formatDate(row.updatedOn),
    sortable: true,
    grow: 1,
  },
  {
    id: 'status',
    name: <Trans id="status" />,
    cell: (row: IOrganizationFinancial) => (
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
];
