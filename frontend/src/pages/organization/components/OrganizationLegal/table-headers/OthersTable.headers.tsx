import React from 'react';
import { TableColumn } from 'react-data-table-component';
import { Person } from '../../../../../common/interfaces/person.interface';
import i18n from '../../../../../common/config/i18n';
import DataTableNameHeader from '../../../../../components/data-table-name-header/DataTableNameHeader';

const translations = {
  name: i18n.t('legal:header.name'),
  role: i18n.t('legal:header.role'),
};

export const OthersTableHeaders: TableColumn<Person>[] = [
  {
    id: 'fullName',
    name: <DataTableNameHeader text={translations.name} />,
    selector: (row: Person) => row.fullName,
    sortable: true,
    grow: 1,
  },
  {
    id: 'role',
    name: <DataTableNameHeader text={translations.role} />,
    selector: (row: Person) => row.role,
    grow: 1,
    sortable: true,
  },
];
