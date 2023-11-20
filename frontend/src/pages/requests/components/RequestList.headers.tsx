import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { formatDate } from '../../../common/helpers/format.helper';
import { IOrganizationRequest } from '../interfaces/Request.interface';
import i18n from '../../../common/config/i18n';
import NameWithLogo from '../../../components/name-with-logo/NameWithLogo';
import DataTableNameHeader from '../../../components/data-table-name-header/DataTableNameHeader';

const translations = {
  organization_name: i18n.t('requests:header.org_name'),
  name: i18n.t('requests:header.name'),
  email: i18n.t('requests:header.email'),
  phone: i18n.t('requests:header.phone'),
  status: i18n.t('requests:header.status'),
  created_on: i18n.t('requests:header.created_on'),
  status_error: i18n.t('requests:header.status_error'),
};

export const RequestListTableHeaders: TableColumn<IOrganizationRequest>[] = [
  {
    id: 'organizationName',
    name: <DataTableNameHeader text={translations.organization_name} />,
    sortable: true,
    selector: (row: IOrganizationRequest) => row.organizationName,
    minWidth: '15rem',
    cell: (row: IOrganizationRequest) => (
      <NameWithLogo name={row.organizationName} logo={row.logo} />
    ),
  },
  {
    id: 'name',
    name: <DataTableNameHeader text={translations.name} />,
    sortable: false,
    selector: (row: IOrganizationRequest) => row.name,
    minWidth: '15rem',
    grow: 1,
  },
  {
    id: 'email',
    name: <DataTableNameHeader text={translations.email} />,
    sortable: false,
    selector: (row: IOrganizationRequest) => row.email,
    grow: 1,
    minWidth: '20rem',
  },
  {
    id: 'phone',
    name: <DataTableNameHeader text={translations.phone} />,
    sortable: false,
    selector: (row: IOrganizationRequest) => row.phone,
    minWidth: '9rem',
    grow: 1,
  },
  {
    id: 'createdOn',
    name: <DataTableNameHeader text={translations.created_on} />,
    sortable: true,
    selector: (row: IOrganizationRequest) => formatDate(row?.createdOn as string),
    minWidth: '10rem',
    grow: 1,
  },
];
