import React, { useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import DataTableComponent from '../../../../components/data-table/DataTableComponent';
import PopoverMenu from '../../../../components/popover-menu/PopoverMenu';
import {
  CompletionStatus,
  FinancialType,
  IOrganizationFinancial,
} from './OrganizationFinancial.interface';
import { OrganizationFinancialTableHeaders } from './OrganizationFinancialTableHeaders';
import { EyeIcon, PencilIcon } from '@heroicons/react/outline';
import ExpenseReportModal from './components/ExpenseReportModal';

const data = [
  {
    id: 1,
    type: FinancialType.EXPENSE,
    year: 2020,
    numberOfEmployees: 10,
    total: 10000,
    updatedOn: new Date(),
    status: CompletionStatus.COMPLETED,
  },
  {
    id: 2,
    type: FinancialType.INCOME,
    year: 2020,
    numberOfEmployees: 12,
    total: 12000,
    updatedOn: new Date(),
    status: CompletionStatus.NOT_COMPLETED,
  },
];

const OrganizationFinancial = () => {
  const [isExpenseReportModalOpen, setIsExpenseReportModalOpen] = useState<boolean>(false);
  const [isIncomeReportModalOpen, setIsIncomeReportModalOpen] = useState<boolean>(false);

  const buildActionColumn = (): TableColumn<IOrganizationFinancial> => {
    const menuItems = [
      {
        name: 'view',
        icon: EyeIcon,
        onClick: onEdit,
      },
      {
        name: 'edit',
        icon: PencilIcon,
        onClick: onView,
      },
    ];

    return {
      name: '',
      cell: (row: IOrganizationFinancial) => <PopoverMenu id={row.id} menuItems={menuItems} />,
      width: '50px',
      allowOverflow: true,
    };
  };

  const onEdit = (rowId: number) => {
    console.log('rowId', rowId);
    setIsExpenseReportModalOpen(true);
  };

  const onView = (rowId: number) => {
    console.log('rowId', rowId);
    setIsExpenseReportModalOpen(true);
  };

  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="p-5 sm:p-10 flex justify-between">
        <span className="font-titilliumBold text-xl text-gray-800">Date Financiare</span>
      </div>

      <div className="w-full border-t border-gray-300" />
      <div className="p-5 sm:p-10">
        <DataTableComponent
          columns={[...OrganizationFinancialTableHeaders, buildActionColumn()]}
          data={data}
        />
      </div>
      <ExpenseReportModal
        open={isExpenseReportModalOpen}
        onClose={() => setIsExpenseReportModalOpen(false)}
      />
    </div>
  );
};

export default OrganizationFinancial;
