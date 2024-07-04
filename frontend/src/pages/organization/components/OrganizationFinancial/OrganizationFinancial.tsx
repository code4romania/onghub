import { EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import React, { useContext, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import { useErrorToast } from '../../../../common/hooks/useToast';
import CardPanel from '../../../../components/card-panel/CardPanel';
import DataTableComponent from '../../../../components/data-table/DataTableComponent';
import PopoverMenu from '../../../../components/popover-menu/PopoverMenu';
import { AuthContext } from '../../../../contexts/AuthContext';
import { useSelectedOrganization } from '../../../../store/selectors';
import { UserRole } from '../../../users/enums/UserRole.enum';
import { FinancialType } from '../../enums/FinancialType.enum';
import { Expense } from '../../interfaces/Expense.interface';
import { Income } from '../../interfaces/Income.interface';
import { OrganizationContext } from '../../interfaces/OrganizationContext';
import { IOrganizationFinancial } from '../../interfaces/OrganizationFinancial.interface';
import ExpenseReportModal from './components/ExpenseReportModal';
import IncomeReportModal from './components/IncomeReportModal';
import { OrganizationFinancialTableHeaders } from './OrganizationFinancialTableHeaders';
import { OrganizationStatus } from '../../enums/OrganizationStatus.enum';
import LoadingContent from '../../../../components/data-table/LoadingContent';
import { useRetryAnafFinancialMutation } from '../../../../services/organization/Organization.queries';

const OrganizationFinancial = () => {
  const [isExpenseReportModalOpen, setIsExpenseReportModalOpen] = useState<boolean>(false);
  const [isIncomeReportModalOpen, setIsIncomeReportModalOpen] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<IOrganizationFinancial | null>(null);
  const [isReadonly, setIsReadonly] = useState<boolean>(false);
  const { organizationFinancial, organization, organizationGeneral } = useSelectedOrganization();
  const { isLoading, updateOrganization } = useOutletContext<OrganizationContext>();

  const { role } = useContext(AuthContext);
  const { t } = useTranslation(['financial', 'organization', 'common']);

  const { mutate: retryAnaf, isLoading: isLoadinAnaf } = useRetryAnafFinancialMutation();

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

  const onUpdateAnaf = () => {
    if (organization && organizationGeneral?.cui) {
      retryAnaf({ organizationId: organization?.id, cui: organizationGeneral?.cui }, {
        onSuccess: (data) => {
          if (data[0].synched_anaf === false) {
            useErrorToast(t('retry_anaf_error'));
          }
        },
        onError: () => {
          useErrorToast(t('retry_anaf_error'));
        }
      });
    }
  }


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
    updateOrganization(
      {
        id: organization?.id,
        organization: {
          financial: {
            id: selectedReport?.id as number,
            data,
          },
        },
      },
      {
        onError: () => {
          useErrorToast(t('save_error', { ns: 'organization' }));
        },
      },
    );
    setIsIncomeReportModalOpen(false);
    setIsExpenseReportModalOpen(false);
  };

  return (
    <CardPanel title={t('title')}>
      <>
        <div className="py-5">
          <p className="sm:text-sm lg:text-base text-xs font-normal text-gray-900">
            {t('data_update', { ns: 'financial' })}
          </p>
        </div>
        {organization?.status === OrganizationStatus.PENDING && organizationFinancial[0].synched_anaf === false && role == UserRole.SUPER_ADMIN && (
          <div className='flex my-2 gap-4 items-center flex-column'>
            <p className='flex'>
              <span className='text-yellow-900 sm:text-sm lg:text-base text-xs font-normal'>{t('retry_anaf_warning')}&nbsp;</span>
            </p>
            <button
              aria-label={t('retry_anaf_button')}
              className="edit-button flex gap-4 justify-center disabled:bg-gray-50"
              onClick={onUpdateAnaf}
              disabled={false}
            >
              {t('retry_anaf_button')}
            </button>
            {isLoadinAnaf && <LoadingContent />}
          </div>)}
        <DataTableComponent
          columns={[...OrganizationFinancialTableHeaders, buildActionColumn()]}
          data={organizationFinancial}
          loading={isLoading}
          defaultSortFieldId={'year'}
          defaultSortAsc={false}
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
