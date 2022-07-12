import React, { useEffect, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import DataTableComponent from '../../../../components/data-table/DataTableComponent';
import PopoverMenu from '../../../../components/popover-menu/PopoverMenu';
import { FinancialType, IOrganizationFinancial } from './OrganizationFinancial.interface';
import { OrganizationFinancialTableHeaders } from './OrganizationFinancialTableHeaders';
import { EyeIcon, PencilIcon } from '@heroicons/react/outline';
import ExpenseReportModal from './components/ExpenseReportModal';
import { useMutation, useQuery } from 'react-query';
import {
  getOrganization,
  patchOrganization,
} from '../../../../services/organization/Organization.service';
import IncomeReportModal from './components/IncomeReportModal';
import { Expense } from './interfaces/Expense';
import { Income } from './interfaces/Income';

const OrganizationFinancial = () => {
  const [isExpenseReportModalOpen, setIsExpenseReportModalOpen] = useState<boolean>(false);
  const [isIncomeReportModalOpen, setIsIncomeReportModalOpen] = useState<boolean>(false);
  const [organizationFinancial, setOrganizationFinancial] = useState<IOrganizationFinancial[]>([]);
  const [selectedReport, setSelectedReport] = useState<IOrganizationFinancial | null>(null);
  const [isReadonly, setIsReadonly] = useState<boolean>(false);
  const id = 10;
  const queryProps = useQuery(['organization', id], () => getOrganization(id));
  const mutationProps = useMutation(
    (update: { financial: { id: number; data: Partial<Expense | Income> } }) =>
      patchOrganization(id, update),
  );

  useEffect(() => {
    if (queryProps.data) {
      setOrganizationFinancial(queryProps.data.organizationFinancial);
    }
  }, [queryProps.data]);

  const buildActionColumn = (): TableColumn<IOrganizationFinancial> => {
    const menuItems = [
      {
        name: 'view',
        icon: EyeIcon,
        onClick: onView,
      },
      {
        name: 'edit',
        icon: PencilIcon,
        onClick: onEdit,
      },
    ];

    return {
      name: '',
      cell: (row: IOrganizationFinancial) => <PopoverMenu row={row} menuItems={menuItems} />,
      width: '50px',
      allowOverflow: true,
    };
  };

  const onEdit = (row: IOrganizationFinancial) => {
    setSelectedReport(row);
    setIsReadonly(false);
    if (row.type === FinancialType.EXPENSE) {
      setIsExpenseReportModalOpen(true);
    } else {
      setIsIncomeReportModalOpen(true);
    }
  };

  const onView = (row: IOrganizationFinancial) => {
    setSelectedReport(row);
    setIsReadonly(true);
    if (row.type === FinancialType.EXPENSE) {
      setIsExpenseReportModalOpen(true);
    } else {
      setIsIncomeReportModalOpen(true);
    }
  };

  const onSave = (data: Partial<Expense | Income>) => {
    mutationProps.mutate({
      financial: {
        id: selectedReport?.id as number,
        data,
      },
    });
  };

  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="p-5 sm:p-10 flex justify-between">
        <span className="font-titilliumBold text-xl text-gray-800">Date Financiare</span>
      </div>

      <div className="w-full border-t border-gray-300" />
      <div className="md:py-5 md:px-10 sm:p-10">
        <div className="pt-1 pb-6">
          <p className="text-base font-normal text-gray-900">
            Te rugam sa actualizezi datele din aceasta sectiune la un interval stabilit de timp.
          </p>
        </div>
        <DataTableComponent
          columns={[...OrganizationFinancialTableHeaders, buildActionColumn()]}
          data={organizationFinancial}
          loading={queryProps.isLoading || mutationProps.isLoading}
        />
      </div>
      {isExpenseReportModalOpen && (
        <ExpenseReportModal
          onClose={() => setIsExpenseReportModalOpen(false)}
          readonly={isReadonly}
          year={selectedReport?.year}
          total={selectedReport?.total}
          defaultValue={selectedReport?.data}
          onSave={onSave}
        />
      )}
      {isIncomeReportModalOpen && (
        <IncomeReportModal
          onClose={() => setIsIncomeReportModalOpen(false)}
          readonly={isReadonly}
          year={selectedReport?.year}
          total={selectedReport?.total}
          defaultValue={selectedReport?.data}
          onSave={onSave}
        />
      )}
    </div>
  );
};

export default OrganizationFinancial;
