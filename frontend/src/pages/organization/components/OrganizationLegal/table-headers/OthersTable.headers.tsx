import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { Person } from '../../../../../common/interfaces/person.interface';

export const OthersTableHeaders: TableColumn<Person>[] = [
  {
    id: 'fullName',
    name: 'Nume si prenume',
    selector: (row: Person) => row.fullName,
    sortable: true,
    grow: 1,
  },
  {
    id: 'role',
    name: 'Rol',
    selector: (row: Person) => row.role,
    grow: 1,
    sortable: true,
  },
];
