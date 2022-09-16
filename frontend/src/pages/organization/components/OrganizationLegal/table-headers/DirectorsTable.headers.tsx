import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { Contact } from '../../../interfaces/Contact.interface';
import i18n from '../../../../../common/config/i18n';

const translations = {
  name: i18n.t('legal:header.name'),
  email: i18n.t('legal:header.email'),
  phone: i18n.t('legal:header.phone'),
};

export const DirectorsTableHeaders: TableColumn<Contact>[] = [
  {
    id: 'fullName',
    name: translations.name,
    selector: (row: Contact) => row.fullName,
    sortable: true,
    grow: 1,
  },
  {
    id: 'email',
    name: translations.email,
    selector: (row: Contact) => row.email,
    grow: 1,
    sortable: true,
  },
  {
    id: 'phone',
    name: translations.phone,
    selector: (row: Contact) => row.phone,
    grow: 1,
    sortable: true,
  },
];
