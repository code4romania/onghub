import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { IOrganizationFinancial } from '../../interfaces/OrganizationFinancial.interface';
import { formatCurrency, formatDate } from '../../../../common/helpers/format.helper';
import StatusBadge, { BadgeStatus } from '../../../../components/status-badge/StatusBadge';
import { FinancialType } from '../../enums/FinancialType.enum';
import { CompletionStatus } from '../../enums/CompletionStatus.enum';

export const OrganizationFinancialTableHeaders: TableColumn<IOrganizationFinancial>[] = [
  {
    id: 'reportName',
    name: 'Raportare',
    cell: (row: IOrganizationFinancial) => (
      <span>
        {row.type === FinancialType.INCOME ? 'Raportare Venituri' : 'Raportare Cheltuieli'}
        {` ${row.year}`}
      </span>
    ),
    grow: 4,
  },
  {
    id: 'year',
    name: 'An',
    selector: (row: IOrganizationFinancial) => row.year,
    sortable: true,
    grow: 0.5,
  },
  {
    id: 'numberOfEmployees',
    name: 'Angajati',
    selector: (row: IOrganizationFinancial) => row.numberOfEmployees,
    sortable: true,
    grow: 0.6,
  },
  {
    id: 'total',
    name: 'Suma',
    selector: (row: IOrganizationFinancial) => formatCurrency(row?.total),
    sortable: true,
    grow: 0.5,
  },
  {
    id: 'updatedOn',
    name: 'Ultima actualizare',
    selector: (row: IOrganizationFinancial) => formatDate(row?.updatedOn as string),
    sortable: true,
    grow: 1,
  },
  {
    id: 'status',
    name: 'Status',
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
