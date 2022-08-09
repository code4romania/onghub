import React, { useEffect, useState } from 'react';
import { SortOrder, TableColumn } from 'react-data-table-component';
import { PaginationConfig } from '../../../../common/config/pagination.config';
import { OrderDirection } from '../../../../common/enums/sort-direction.enum';
import { useErrorToast } from '../../../../common/hooks/useToast';
import DataTableFilters from '../../../../components/data-table-filters/DataTableFilters';
import DataTableComponent from '../../../../components/data-table/DataTableComponent';
import { useUsersQuery } from '../../../../services/user/User.queries';
import { useUser } from '../../../../store/selectors';
import { UserListTableHeaders } from './table-headers/UserListTable.headers';

const UserList = () => {
  const [page, setPage] = useState<number>(PaginationConfig.defaultPage);
  const [rowsPerPage, setRowsPerPage] = useState<number>(PaginationConfig.defaultRowsPerPage);
  const [orderByColumn, setOrderByColumn] = useState<string>('name');
  const [orderDirection, setOrderDirection] = useState<OrderDirection>(OrderDirection.ASC);

  const { users } = useUser();

  const { isLoading, error } = useUsersQuery(rowsPerPage, page, orderByColumn, orderDirection);

  useEffect(() => {
    if (error) useErrorToast('Error while loading the users');
  }, [error]);

  const onRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
  };

  const onChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const onSort = (column: TableColumn<string>, direction: SortOrder) => {
    setOrderByColumn(column.id as string);
    setOrderDirection(
      direction.toLocaleUpperCase() === OrderDirection.ASC
        ? OrderDirection.ASC
        : OrderDirection.DESC,
    );
  };

  return (
    <div>
      <DataTableFilters />
      <div className="w-full bg-white shadow rounded-lg my-6">
        <div className="py-5 px-10 flex items-center justify-between border-b border-gray-200">
          <p className="text-gray-800 font-titilliumBold text-xl">Utilizatori</p>
          {/* Uncomment once download will be implemented */}
          {/* <button type="button" className="edit-button">
            Descarca Tabel
          </button> */}
        </div>
        <div className="pb-5 px-10">
          <DataTableComponent
            columns={UserListTableHeaders}
            data={users.items}
            loading={isLoading}
            pagination
            sortServer
            paginationPerPage={users.meta.itermsPerPage}
            paginationRowsPerPageOptions={PaginationConfig.rowsPerPageOptions}
            paginationTotalRows={users.meta.totalItems}
            onChangeRowsPerPage={onRowsPerPageChange}
            onChangePage={onChangePage}
            onSort={onSort}
          />
        </div>
      </div>
    </div>
  );
};

export default UserList;
