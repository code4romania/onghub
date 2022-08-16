import React, { useEffect, useState } from 'react';
import { BanIcon } from '@heroicons/react/outline';
import { PencilIcon, RefreshIcon, TrashIcon } from '@heroicons/react/solid';
import { SortOrder, TableColumn } from 'react-data-table-component';
import { PaginationConfig } from '../../../../common/config/pagination.config';
import { OrderDirection } from '../../../../common/enums/sort-direction.enum';
import { useErrorToast } from '../../../../common/hooks/useToast';
import DataTableFilters from '../../../../components/data-table-filters/DataTableFilters';
import DataTableComponent from '../../../../components/data-table/DataTableComponent';
import PopoverMenu, { PopoverMenuRowType } from '../../../../components/popover-menu/PopoverMenu';
import DateRangePicker from '../../../../components/date-range-picker/DateRangePicker';
import Select from '../../../../components/Select/Select';
import { useUsersQuery } from '../../../../services/user/User.queries';
import { useUser } from '../../../../store/selectors';
import { UserStatusOptions } from '../../constants/filters.constants';
import { UserStatus } from '../../enums/UserStatus.enum';
import { IUser } from '../../interfaces/User.interface';
import { UserListTableHeaders } from './table-headers/UserListTable.headers';

const UserList = () => {
  const [page, setPage] = useState<number>();
  const [rowsPerPage, setRowsPerPage] = useState<number>();
  const [orderByColumn, setOrderByColumn] = useState<string>();
  const [orderDirection, setOrderDirection] = useState<OrderDirection>();
  const [searchWord, setSearchWord] = useState<string | null>(null);
  const [status, setStatus] = useState<{ status: UserStatus; label: string } | null>();
  const [range, setRange] = useState<Date[]>([]);

  const { users } = useUser();

  const { isLoading, error } = useUsersQuery(
    rowsPerPage as number,
    page as number,
    orderByColumn as string,
    orderDirection as OrderDirection,
    searchWord as string,
    status?.status,
    range,
  );

  useEffect(() => {
    if (users?.meta) {
      setPage(users.meta.currentPage);
      setRowsPerPage(users.meta.itermsPerPage);
      setOrderByColumn(users.meta.orderByColumn);
      setOrderDirection(users.meta.orderDirection);
    }
  }, []);

  useEffect(() => {
    if (error) useErrorToast('Error while loading the users');
  }, [error]);

  const buildUserActionColumn = (): TableColumn<IUser> => {
    const activeUserMenuItems = [
      {
        name: 'Editeaza',
        icon: PencilIcon,
        onClick: onEdit,
      },
      {
        name: 'Restrictioneaza temporar',
        icon: BanIcon,
        onClick: onDisconnect,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    const restrictedUserMenuItems = [
      {
        name: 'Reda accesul',
        icon: RefreshIcon,
        onClick: onReconnect,
      },
      {
        name: 'Editeaza',
        icon: PencilIcon,
        onClick: onEdit,
      },
      {
        name: 'Elimina definitiv',
        icon: TrashIcon,
        onClick: onDelete,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    return {
      name: '',
      cell: (row: IUser) => (
        <PopoverMenu
          row={row}
          menuItems={
            row.status === UserStatus.ACTIVE ? activeUserMenuItems : restrictedUserMenuItems
          }
        />
      ),
      width: '50px',
      allowOverflow: true,
    };
  };

  /**
   * PAGINATION
   */
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

  /**
   * ROW ACTIONS
   */
  const onReconnect = () => {
    console.log('to be implemented');
  };

  const onEdit = () => {
    console.log('to be implemented');
  };

  const onDelete = () => {
    console.log('to be implemented');
  };

  const onDisconnect = () => {
    console.log('to be implemented');
  };

  /**
   * FILTERS
   */
  const onSearch = (searchWord: string) => {
    setSearchWord(searchWord);
  };

  const onDateChange = (interval: unknown[]) => {
    if (interval[0] && interval[1]) {
      setRange(interval as Date[]);
    }
  };

  const onStatusChange = (selected: { status: UserStatus; label: string }) => {
    setStatus(selected);
  };

  const onResetFilters = () => {
    setStatus(null);
    setRange([]);
    setSearchWord(null);
  };

  return (
    <div>
      <DataTableFilters
        onSearch={onSearch}
        searchValue={searchWord}
        onResetFilters={onResetFilters}
      >
        <div className="flex gap-x-6">
          <div className="basis-1/4">
            <DateRangePicker label="Data adaugarii" onChange={onDateChange} />
          </div>
          <div className="basis-1/4">
            <Select
              config={{
                label: 'Status',
                collection: UserStatusOptions,
                displayedAttribute: 'label',
              }}
              selected={status}
              onChange={onStatusChange}
            />
          </div>
        </div>
      </DataTableFilters>
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
            columns={[...UserListTableHeaders, buildUserActionColumn()]}
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
