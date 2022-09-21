import React from 'react';
import { TableColumn } from 'react-data-table-component';
import i18n from '../../../../../common/config/i18n';
import { formatDate } from '../../../../../common/helpers/format.helper';
import NameWithLogo from '../../../../../components/name-with-logo/NameWithLogo';
import { OrganizationApplicationRequest } from '../../../../../services/application/interfaces/Application.interface';

const translations = {
  name: i18n.t('appstore:header.name'),
  createdOn: i18n.t('common:created_on'),
};

export const OrganizationApplicationRequestsTableHeaders: TableColumn<OrganizationApplicationRequest>[] =
  [
    {
      id: 'name',
      name: translations.name,
      sortable: true,
      grow: 6,
      selector: (row) => row.name,
      cell: (row: OrganizationApplicationRequest) => (
        <NameWithLogo logo={row.logo} name={row.name} />
      ),
    },
    {
      id: 'createdOn',
      sortable: true,
      name: translations.createdOn,
      grow: 1,
      selector: (row: OrganizationApplicationRequest) => formatDate(row.createdOn),
    },
  ];
