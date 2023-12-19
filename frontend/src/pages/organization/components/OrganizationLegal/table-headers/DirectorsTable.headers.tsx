import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { Contact } from '../../../interfaces/Contact.interface';
import i18n from '../../../../../common/config/i18n';
import DataTableNameHeader from '../../../../../components/data-table-name-header/DataTableNameHeader';

const translations = {
  name: i18n.t('legal:header.name'),
  email: i18n.t('legal:header.email'),
  phone: i18n.t('legal:header.phone'),
};

export const DirectorsTableHeaders: TableColumn<Contact>[] = [
  {
    id: 'fullName',
    name: <DataTableNameHeader text={translations.name} />,
    selector: (row: Contact) => row.fullName,
    sortable: true,
    minWidth: '10rem',
    grow: 1,
  },
  {
    id: 'email',
    name: <DataTableNameHeader text={translations.email} />,
    selector: (row: Contact) => row.email,
    grow: 1,
    minWidth: '15rem',
    sortable: true,
  },
  {
    id: 'phone',
    name: <DataTableNameHeader text={translations.phone} />,
    selector: (row: Contact) => row.phone,
    grow: 1,
    minWidth: '10rem',
    sortable: true,
  },
];
