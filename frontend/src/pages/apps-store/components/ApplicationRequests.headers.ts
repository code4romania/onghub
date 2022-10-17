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
    grow: 3,
    minWidth: '10rem',
    selector: (row: IApplicationRequest) => row.application?.name || '',
  },
  {
    id: 'ong',
    name: translations.ong,
    grow: 2,
    minWidth: '15rem',
    selector: (row: IApplicationRequest) => row.organization?.organizationGeneral?.name || '',
  },
  {
    id: 'created_on',
    name: translations.created_on,
    minWidth: '10rem',
    selector: (row: IApplicationRequest) => formatDate(row.createdOn as string),
  },
];
