import React, { useEffect, useState } from 'react';
import { SortOrder, TableColumn } from 'react-data-table-component';
import { PaginationConfig } from '../../common/config/pagination.config';
import { OrderDirection } from '../../common/enums/sort-direction.enum';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import DataTableComponent from '../../components/data-table/DataTableComponent';
import { useOrganizationsQuery } from '../../services/organization/Organization.queries';
import { useOrganizations } from '../../store/selectors';
import { OrganizationsTableHeaders } from './table-headers/OrganizationsTable.headers';

const Organizations = () => {
  const [page, setPage] = useState<number>();
  const [rowsPerPage, setRowsPerPage] = useState<number>();
  const [orderByColumn, setOrderByColumn] = useState<string>();
  const [orderDirection, setOrderDirection] = useState<OrderDirection>();

  const { organizations } = useOrganizations();

  const { isLoading, error, refetch } = useOrganizationsQuery(
    rowsPerPage as number,
    page as number,
    orderByColumn as string,
    orderDirection as OrderDirection,
  );

  useEffect(() => {
    if (organizations?.meta) {
      setPage(organizations.meta.currentPage);
      setRowsPerPage(organizations.meta.itemsPerPage);
      setOrderByColumn(organizations.meta.orderByColumn);
      setOrderDirection(organizations.meta.orderDirection);
    }
  }, []);

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

  return (
    <ContentWrapper
      title="ONG-uri"
      subtitle="Administreaza aici accesul pentru organizatiile din sistem. "
    >
      <div className="w-full bg-white shadow rounded-lg my-6">
        <div className="py-5 px-10 flex items-center justify-between border-b border-gray-200">
          <p className="text-gray-800 font-titilliumBold text-xl">Lista ONG-uri</p>
        </div>
        <div className="pb-5 px-10">
          <DataTableComponent
            columns={[...OrganizationsTableHeaders]}
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
