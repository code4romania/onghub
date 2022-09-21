import React, { useEffect, useState } from 'react';
import { SortOrder, TableColumn } from 'react-data-table-component';
import { PaginationConfig } from '../../../../common/config/pagination.config';
import { OrderDirection } from '../../../../common/enums/sort-direction.enum';
import { useErrorToast } from '../../../../common/hooks/useToast';
import DataTableFilters from '../../../../components/data-table-filters/DataTableFilters';
import DataTableComponent from '../../../../components/data-table/DataTableComponent';
import PopoverMenu from '../../../../components/popover-menu/PopoverMenu';
import DateRangePicker from '../../../../components/date-range-picker/DateRangePicker';
import { useCognitoUsersQuery, useUsersQuery } from '../../../../services/user/User.queries';
import { useUser } from '../../../../store/selectors';
import { IUser } from '../../interfaces/User.interface';
import { UserInvitesTableHeaders } from './table-headers/UserInvitesTable.headers';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ReplyIcon } from '@heroicons/react/outline';

const UserList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>();
  const [rowsPerPage, setRowsPerPage] = useState<number>();
  const [orderByColumn, setOrderByColumn] = useState<string>();
  const [orderDirection, setOrderDirection] = useState<OrderDirection>();
  const [searchWord, setSearchWord] = useState<string | null>(null);
  const [range, setRange] = useState<Date[]>([]);
  const [AttributesToGet, setAttributesToGet] = useState<string[]>();
  const [Filter, setFilter] = useState<string>();

  const { users, invites } = useUser();

  const { t } = useTranslation(['user', 'common']);

  // const { isLoading, error, refetch } = useUsersQuery(
  //   rowsPerPage as number,
  //   page as number,
  //   orderByColumn as string,
  //   orderDirection as OrderDirection,
  //   searchWord as string,
  //   undefined,
  //   range,
  // );
  const { isLoading, error, refetch } = useCognitoUsersQuery({
    AttributesToGet: ['name', 'email', 'phone_number'],
    Filter: 'cognito:user_status = "FORCE_CHANGE_PASSWORD"',
  });

  useEffect(() => {
    if (invites?.meta) {
      setPage(invites.meta.currentPage);
      setRowsPerPage(invites.meta.itemsPerPage);
      setOrderByColumn(invites.meta.orderByColumn);
      setOrderDirection(invites.meta.orderDirection);
    }
  }, []);

  // useEffect(() => {
  //   if (error) useErrorToast(t('list.load_error'));
  // }, [error]);

  const buildUserActionColumn = (): TableColumn<IUser> => {
    const pendingUserMenuItems = [
      {
        name: t('edit', { ns: 'common' }),
        icon: ReplyIcon,
        onClick: onEdit,
      },
    ];

    return {
      name: '',
      cell: (row: IUser) => <PopoverMenu row={row} menuItems={pendingUserMenuItems} />,
      width: '50px',
      allowOverflow: true,
    };
  };

  /**
   * PAGINATION
   */
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

  const onEdit = (row: IUser) => {
    navigate(`/user/${row.id}`);
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

  const onResetFilters = () => {
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
            <DateRangePicker
              label={t('list.date')}
              defaultValue={range.length > 0 ? range : undefined}
              onChange={onDateChange}
            />
          </div>
        </div>
      </DataTableFilters>
      <div className="w-full bg-white shadow rounded-lg my-6">
        <div className="py-5 px-10 flex items-center justify-between border-b border-gray-200">
          <p className="text-gray-800 font-titilliumBold text-xl">{t('title')}</p>
          {/* Uncomment once download will be implemented */}
          {/* <button type="button" className="edit-button">
            Descarca Tabel
          </button> */}
        </div>
        <div className="pb-5 px-10">
          <DataTableComponent
            columns={[...UserInvitesTableHeaders, buildUserActionColumn()]}
            data={invites.items}
            loading={isLoading}
            sortServer
            paginationPerPage={invites.meta.itemsPerPage}
            paginationRowsPerPageOptions={PaginationConfig.rowsPerPageOptions}
            onSort={onSort}
          />
        </div>
      </div>
    </div>
  );
};

export default UserList;
