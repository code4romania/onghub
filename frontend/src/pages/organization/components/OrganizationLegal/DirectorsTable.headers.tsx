import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { Contact } from '../../interfaces/Contact.interface';

export const DirectorsTableHeaders: TableColumn<Contact>[] = [
  {
    id: 'fullName',
    name: 'Nume si prenume',
    selector: (row: Contact) => row.fullName,
    sortable: true,
    grow: 1,
  },
  {
    id: 'email',
    name: 'Email',
    selector: (row: Contact) => row.email,
    grow: 1,
    sortable: true,
  },
  {
    id: 'phone',
    name: 'Telefon',
    selector: (row: Contact) => row.phone,
    grow: 1,
    sortable: true,
  },
];
