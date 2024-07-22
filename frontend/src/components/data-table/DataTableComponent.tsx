import React from 'react';
import DataTable, { SortOrder, TableColumn } from 'react-data-table-component';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import EmptyContent from './EmptyContent';
import LoadingContent from './LoadingContent';
import { classNames } from '../../common/helpers/tailwind.helper';
import { useTranslation } from 'react-i18next';

interface DataTableProps {
  columns: TableColumn<any>[];
  data: any[];
  loading?: boolean;
  pagination?: boolean;
  sortServer?: boolean;
  paginationPerPage?: number;
  paginationRowsPerPageOptions?: number[];
  paginationTotalRows?: number;
  paginationDefaultPage?: number;
  onChangePage?: (page: number) => void;
  onChangeRowsPerPage?: (rowsPerPage: number) => void;
  onRowClicked?: (row: any) => void;
  onSort?: (selectedColumn: TableColumn<any>, sortDirection: SortOrder, sortedRows: any[]) => void;
  defaultSortFieldId?: string | number;
  defaultSortAsc?: boolean;
}

const DataTableComponent = ({
  columns,
  data,
  loading,
  pagination,
  sortServer,
  paginationPerPage,
  paginationRowsPerPageOptions,
  paginationTotalRows,
  paginationDefaultPage,
  onSort,
  onChangePage,
  onChangeRowsPerPage,
  onRowClicked,
  defaultSortFieldId,
  defaultSortAsc,
}: DataTableProps) => {
  const { t } = useTranslation('pagination');

  return (
    <div
      className={classNames(
        !loading && data?.length > 0 ? 'border-gray-200' : '',
        'rdt_TableWrapper',
      )}
    >
      <DataTable
        conditionalRowStyles={[
          {
            when: () => !!onRowClicked,
            style: { cursor: 'pointer' },
            classNames: ['hover:bg-gray-50'],
          },
        ]}
        noHeader
        columns={columns}
        data={data || []}
        progressPending={loading}
        pagination={pagination}
        paginationServer={pagination}
        paginationComponentOptions={{
          rowsPerPageText: (t('rows_per_page') as string) || '',
          rangeSeparatorText: (t('range_separator_text') as string) || '',
        }}
        paginationDefaultPage={paginationDefaultPage}
        responsive
        sortIcon={<ChevronDownIcon />}
        sortServer={sortServer}
        onSort={onSort}
        paginationTotalRows={paginationTotalRows}
        paginationPerPage={paginationPerPage}
        paginationRowsPerPageOptions={paginationRowsPerPageOptions}
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
        noDataComponent={<EmptyContent />}
        progressComponent={
          <div className="flex justify-center items-center  pt-28">
            <LoadingContent />
          </div>
        }
        defaultSortFieldId={defaultSortFieldId}
        defaultSortAsc={defaultSortAsc}
        onRowClicked={onRowClicked}
      />
    </div>
  );
};

export default DataTableComponent;
