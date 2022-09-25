import { BanIcon, EyeIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';
import { SortOrder, TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PaginationConfig } from '../../common/config/pagination.config';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { useErrorToast } from '../../common/hooks/useToast';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import DataTableFilters from '../../components/data-table-filters/DataTableFilters';
import DataTableComponent from '../../components/data-table/DataTableComponent';
import DateRangePicker from '../../components/date-range-picker/DateRangePicker';
import PopoverMenu, { PopoverMenuRowType } from '../../components/popover-menu/PopoverMenu';
import Select from '../../components/Select/Select';
import { useOrganizationsQuery } from '../../services/organization/Organization.queries';
import { useOrganizations } from '../../store/selectors';
import {
  OrganizationCompletionStatusOptions,
  OrganizationsUsersCountOptions,
} from './constants/filters.constants';
import { IOrganizationView } from './interfaces/Organization.interface';
import { OrganizationsTableHeaders } from './table-headers/OrganizationsTable.headers';

const Organizations = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>();
  const [rowsPerPage, setRowsPerPage] = useState<number>();
  const [orderByColumn, setOrderByColumn] = useState<string>();
  const [orderDirection, setOrderDirection] = useState<OrderDirection>();
  const [searchWord, setSearchWord] = useState<string | null>(null);
  const [createdOnRange, setCreatedOnRange] = useState<Date[]>([]);
  const [status, setStatus] = useState<{ status: number; label: string } | null>();
  const [usersRange, setUserRange] = useState<{ status: string; label: string } | null>(null);

  const { organizations } = useOrganizations();

  const { t } = useTranslation(['organizations', 'common']);

  const { isLoading, error: getOrganizationsError } = useOrganizationsQuery(
    rowsPerPage as number,
    page as number,
    orderByColumn as string,
    orderDirection as OrderDirection,
    searchWord as string,
    status?.status,
    createdOnRange,
    usersRange?.status as string,
  );

  useEffect(() => {
    if (organizations?.meta) {
      setPage(organizations.meta.currentPage);
      setRowsPerPage(organizations.meta.itemsPerPage);
      setOrderByColumn(organizations.meta.orderByColumn);
      setOrderDirection(organizations.meta.orderDirection);
    }
  }, []);

  useEffect(() => {
    if (getOrganizationsError) useErrorToast(t('load_error'));
  }, [getOrganizationsError]);

  /**
   * FILTERS
   */
  const onSearch = (searchWord: string) => {
    setSearchWord(searchWord);
  };

  const onDateChange = (interval: unknown[]) => {
    if (interval[0] && interval[1]) {
      setCreatedOnRange(interval as Date[]);
    }
  };

  const onStatusChange = (selected: { status: number; label: string }) => {
    setStatus(selected);
  };

  const onUsersRangeChange = (selected: { status: string; label: string }) => {
    setUserRange(selected);
  };

  const onResetFilters = () => {
    setStatus(null);
    setCreatedOnRange([]);
    setSearchWord(null);
    setUserRange(null);
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

  const buildOrganizationsActionColumn = (): TableColumn<IOrganizationView> => {
    const activeOrganizationsMenuItems = [
      {
        name: t('view'),
        icon: EyeIcon,
        onClick: onViewOrganization,
      },
      {
        name: t('restrict'),
        icon: BanIcon,
        onClick: () => console.log('To be implemented'),
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    return {
      name: '',
      cell: (row: IOrganizationView) => (
        <PopoverMenu row={row} menuItems={activeOrganizationsMenuItems} />
      ),
      width: '50px',
      allowOverflow: true,
    };
  };

  const onViewOrganization = (row: IOrganizationView) => {
    console.log('row', row);
    navigate(`/organizations/${row.id}`);
  };

  return (
    <ContentWrapper title={t('title')} subtitle={t('administer')}>
      <DataTableFilters
        onSearch={onSearch}
        searchValue={searchWord}
        onResetFilters={onResetFilters}
      >
        <div className="flex gap-x-6">
          <div className="basis-1/4">
            <DateRangePicker
              label={t('filter.registration')}
              defaultValue={createdOnRange.length > 0 ? createdOnRange : undefined}
              onChange={onDateChange}
            />
          </div>
          <div className="basis-1/4">
            <Select
              config={{
                label: t('filter.users'),
                collection: OrganizationsUsersCountOptions,
                displayedAttribute: 'label',
              }}
              selected={usersRange}
              onChange={onUsersRangeChange}
            />
          </div>
          <div className="basis-1/4">
            <Select
              config={{
                label: t('filter.status'),
                collection: OrganizationCompletionStatusOptions,
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
          <p className="text-gray-800 font-titilliumBold text-xl">{t('list')}</p>
        </div>
        <div className="pb-5 px-10">
          <DataTableComponent
            columns={[...OrganizationsTableHeaders, buildOrganizationsActionColumn()]}
            data={organizations.items}
            loading={isLoading}
            pagination
            sortServer
            paginationPerPage={organizations.meta.itemsPerPage}
            paginationRowsPerPageOptions={PaginationConfig.rowsPerPageOptions}
            paginationTotalRows={organizations.meta.totalItems}
            onChangeRowsPerPage={onRowsPerPageChange}
            onChangePage={onChangePage}
            onSort={onSort}
          />
        </div>
      </div>
    </ContentWrapper>
  );
};

export default Organizations;
