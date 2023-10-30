import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { formatDate } from '../../../common/helpers/format.helper';
import { IApplicationRequest } from '../../requests/interfaces/Request.interface';
import i18n from '../../../common/config/i18n';

const translations = {
  name: i18n.t('appstore:request_header.name'),
  ong: i18n.t('appstore:request_header.ong'),
  created_on: i18n.t('appstore:request_header.created_on'),
};

export const ApplicationRequestsTableHeaders: TableColumn<IApplicationRequest>[] = [
  {
    id: 'name',
    name: translations.name,
    grow: 1,
    selector: (row: IApplicationRequest) => row.application?.name || '',
  },
  {
    id: 'ong',
    name: translations.ong,
    grow: 1,
    cell: (row: IApplicationRequest) => (
      <a
        className="text-blue-500 hover:text-blue-800 font-titilliumSemiBold"
        href={`/organizations/${row.organization?.id}`}
      >
        {row.organization?.organizationGeneral?.name}
      </a>
    ),
    selector: (row: IApplicationRequest) => row.organization?.organizationGeneral?.name || '',
  },
  {
    id: 'created_on',
    name: translations.created_on,
    grow: 0.5,
    selector: (row: IApplicationRequest) => formatDate(row.createdOn as string),
  },
];
