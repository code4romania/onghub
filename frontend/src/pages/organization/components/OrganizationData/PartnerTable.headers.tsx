import React from 'react';
import { Trans } from '@lingui/react';
import { TableColumn } from 'react-data-table-component';
import { formatDate } from '../../../../common/helpers/format.helper';
import StatusBadge, { BadgeStatus } from '../../../../components/status-badge/StatusBadge';
import { CompletionStatus } from '../../enums/CompletionStatus.enum';
import { Partner } from '../../interfaces/Partner.interface';

export const PartnerTableHeaders: TableColumn<Partner>[] = [
  {
    id: 'name',
    name: 'Lista parteneri',
    selector: (row: Partner) => `Parteneri ${row.year}`,
    grow: 4,
  },
  {
    id: 'year',
    name: 'An',
    selector: (row: Partner) => row.year,
    grow: 1,
    sortable: true,
  },
  {
    id: 'numberOfPartners',
    name: 'Numar parteneri',
    selector: (row: Partner) => row.numberOfPartners || 'N/A',
    grow: 1.5,
    sortable: true,
  },
  {
    id: 'status',
    name: <Trans id="status" />,
    cell: (row: Partner) => (
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
  {
    id: 'updatedOn',
    name: <Trans id="updateOn" />,
    selector: (row: Partner) => formatDate(row?.updatedOn as string),
    sortable: true,
    grow: 1,
  },
];
