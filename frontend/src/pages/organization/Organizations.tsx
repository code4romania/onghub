import { BanIcon, EyeIcon, RefreshIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';
import { SortOrder, TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PaginationConfig } from '../../common/config/pagination.config';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { useErrorToast, useSuccessToast } from '../../common/hooks/useToast';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import DataTableFilters from '../../components/data-table-filters/DataTableFilters';
import DataTableComponent from '../../components/data-table/DataTableComponent';
import DateRangePicker from '../../components/date-range-picker/DateRangePicker';
import PopoverMenu, { PopoverMenuRowType } from '../../components/popover-menu/PopoverMenu';
import Select from '../../components/Select/Select';
import {
  useActivateOrganizationMutation,
  useOrganizationsQuery,
  useRestrictOrganizationMutation,
} from '../../services/organization/Organization.queries';
import { useOrganizations } from '../../store/selectors';
import {
  OrganizationCompletionStatusOptions,
  OrganizationsUsersCountOptions,
} from './constants/filters.constants';
import { CompletionStatus } from './enums/CompletionStatus.enum';
import { OrganizationStatus } from './enums/OrganizationStatus.enum';
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
  const [status, setStatus] = useState<{ status: CompletionStatus; label: string } | null>();
  const [usersRange, setUserRange] = useState<{ status: string; label: string } | null>(null);

  const { organizations } = useOrganizations();

  const { t } = useTranslation(['organizations', 'common']);

  const {
    isLoading,
    error: getOrganizationsError,
    refetch,
  } = useOrganizationsQuery(
    rowsPerPage as number,
    page as number,
    orderByColumn as string,
    orderDirection as OrderDirection,
    searchWord as string,
    status?.status,
    createdOnRange,
    usersRange?.status as string,
  );

  const restrictOrganizationMutation = useRestrictOrganizationMutation();
  const activateOrganizationMutation = useActivateOrganizationMutation();

  useEffect(() => {
    if (organizations?.meta) {
      setPage(1);
      setRowsPerPage(organizations.meta.itemsPerPage);
      setOrderByColumn(organizations.meta.orderByColumn);
      setOrderDirection(organizations.meta.orderDirection);
    }
  }, []);

  useEffect(() => {
    if (getOrganizationsError) useErrorToast(t('load_error'));

    if (restrictOrganizationMutation.error) useErrorToast(t('restrict_error'));

    if (activateOrganizationMutation.error) useErrorToast(t('activate_error'));
  }, [
    getOrganizationsError,
    restrictOrganizationMutation.error,
    activateOrganizationMutation.error,
  ]);

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

  const onStatusChange = (selected: { status: CompletionStatus; label: string }) => {
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
        onClick: onRestrictOrganization,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    const restrictedOrganizationMenuItems = [
      {
        name: t('view'),
        icon: EyeIcon,
        onClick: onViewOrganization,
      },
      {
        name: t('activate'),
        icon: RefreshIcon,
        onClick: onActivateOrganization,
      },
    ];

    return {
      name: '',
      cell: (row: IOrganizationView) => (
        <PopoverMenu
          row={row}
          menuItems={
            row.status === OrganizationStatus.ACTIVE
              ? activeOrganizationsMenuItems
              : restrictedOrganizationMenuItems
          }
        />
      ),
      width: '50px',
      allowOverflow: true,
    };
  };

  const onViewOrganization = (row: IOrganizationView) => {
    navigate(`/organizations/${row.id}`);
  };

  const onRestrictOrganization = (row: IOrganizationView) => {
    restrictOrganizationMutation.mutate(row.id, {
      onSuccess: () => {
        useSuccessToast(t('restrict_success'));
        refetch();
      },
    });
  };

  const onActivateOrganization = (row: IOrganizationView) => {
    activateOrganizationMutation.mutate(row.id, {
      onSuccess: () => {
        useSuccessToast(t('activate_success'));
        refetch();
      },
    });
  };

  return (
    <ContentWrapper title={t('title')} subtitle={t('administer')}>
      <DataTableFilters
        onSearch={onSearch}
        searchValue={searchWord}
        onResetFilters={onResetFilters}
      >
        <div className="flex gap-x-6 flex-wrap gap-y-3">
          <div className="sm:basis-1/4 w-full">
            <DateRangePicker
              label={t('filter.registration')}
              value={createdOnRange.length > 0 ? createdOnRange : undefined}
              onChange={onDateChange}
            />
          </div>
          <div className="sm:basis-1/4 w-full">
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
          <div className="sm:basis-1/4 w-full">
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
        <div className="py-5 lg:px-10 px-5 flex items-center justify-between border-b border-gray-200">
          <p className="text-gray-800 font-titilliumBold sm:text-lg lg:text-xl text-md">
            {t('list')}
          </p>
        </div>
        <div className="pb-2">
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
