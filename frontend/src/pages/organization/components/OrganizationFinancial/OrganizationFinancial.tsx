import { EyeIcon, PencilIcon } from '@heroicons/react/outline';
import React, { useContext, useEffect, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useErrorToast } from '../../../../common/hooks/useToast';
import CardPanel from '../../../../components/card-panel/CardPanel';
import DataTableComponent from '../../../../components/data-table/DataTableComponent';
import PopoverMenu from '../../../../components/popover-menu/PopoverMenu';
import { AuthContext } from '../../../../contexts/AuthContext';
import {
  useOrganizationByProfileMutation,
  useOrganizationMutation,
} from '../../../../services/organization/Organization.queries';
import { useSelectedOrganization } from '../../../../store/selectors';
import { UserRole } from '../../../users/enums/UserRole.enum';
import { REQUEST_LOCATION } from '../../constants/location.constants';
import { FinancialType } from '../../enums/FinancialType.enum';
import { Expense } from '../../interfaces/Expense.interface';
import { Income } from '../../interfaces/Income.interface';
import { IOrganizationFinancial } from '../../interfaces/OrganizationFinancial.interface';
import ExpenseReportModal from './components/ExpenseReportModal';
import IncomeReportModal from './components/IncomeReportModal';
import { OrganizationFinancialTableHeaders } from './OrganizationFinancialTableHeaders';

const OrganizationFinancial = () => {
  const [isExpenseReportModalOpen, setIsExpenseReportModalOpen] = useState<boolean>(false);
  const [isIncomeReportModalOpen, setIsIncomeReportModalOpen] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<IOrganizationFinancial | null>(null);
  const [isReadonly, setIsReadonly] = useState<boolean>(false);
  const { organizationFinancial, organization } = useSelectedOrganization();
  const { mutate, isLoading, error } = location.pathname.includes(REQUEST_LOCATION)
    ? useOrganizationMutation()
    : useOrganizationByProfileMutation();

  const { role } = useContext(AuthContext);
  const { t } = useTranslation(['financial', 'organization', 'common']);

  useEffect(() => {
    if (error) useErrorToast(t('save_error'));
  }, [error]);

  const buildActionColumn = (): TableColumn<IOrganizationFinancial> => {
    const employeeMenuItems = [
      {
        name: t('view', { ns: 'common' }),
        icon: EyeIcon,
        onClick: onView,
      },
    ];

    const adminMenuItems = [
      {
        name: t('view', { ns: 'common' }),
        icon: EyeIcon,
        onClick: onView,
      },
      {
        name: t('edit', { ns: 'common' }),
        icon: PencilIcon,
        onClick: onEdit,
      },
    ];

    return {
      name: '',
      cell: (row: IOrganizationFinancial) => (
        <PopoverMenu
          row={row}
          menuItems={role === UserRole.EMPLOYEE ? employeeMenuItems : adminMenuItems}
        />
      ),
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
    mutate({
      id: organization?.id,
      organization: {
        financial: {
          id: selectedReport?.id as number,
          data,
        },
      },
    });
    setIsIncomeReportModalOpen(false);
    setIsExpenseReportModalOpen(false);
  };

  return (
    <CardPanel title={t('title')}>
      <>
        <div className="pt-1 pb-6">
          <p className="text-base font-normal text-gray-900">
            {t('data_update', { ns: 'organization' })}
          </p>
        </div>
        <DataTableComponent
          columns={[...OrganizationFinancialTableHeaders, buildActionColumn()]}
          data={organizationFinancial}
          loading={isLoading}
        />
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
      </>
    </CardPanel>
  );
};

export default OrganizationFinancial;
