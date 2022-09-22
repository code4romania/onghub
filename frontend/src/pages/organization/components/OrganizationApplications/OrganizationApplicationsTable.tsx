import { BanIcon, RefreshIcon } from '@heroicons/react/outline';
import { TrashIcon } from '@heroicons/react/solid';
import React, { useEffect, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useTranslation } from 'react-i18next';
import { useErrorToast } from '../../../../common/hooks/useToast';
import DataTableFilters from '../../../../components/data-table-filters/DataTableFilters';
import DataTableComponent from '../../../../components/data-table/DataTableComponent';
import PopoverMenu, { PopoverMenuRowType } from '../../../../components/popover-menu/PopoverMenu';
import Select from '../../../../components/Select/Select';
import {
  useRestoreApplicationMutation,
  useRestrictApplicationMutation,
} from '../../../../services/application/Application.queries';
import { ApplicationWithOngStatus } from '../../../../services/application/interfaces/Application.interface';
import { useOrganizationApplicationsQuery } from '../../../../services/organization/Organization.queries';
import {
  ApplicationTypeCollection,
  ApplicationTypeEnum,
} from '../../../apps-store/constants/ApplicationType.enum';
import { OngApplicationStatus } from '../../../requests/interfaces/OngApplication.interface';
import { OrganizationApplicationsTableHeaders } from './table-headers/OrganizationApplicationsTable.headers';

const OrganizationApplicationsTable = ({ organizationId }: { organizationId: string }) => {
  const [searchWord, setSearchWord] = useState<string | null>(null);
  const [type, setType] = useState<{ type: ApplicationTypeEnum; label: string } | null>();
  const [applications, setApplications] = useState<ApplicationWithOngStatus[]>([]);

  const { t } = useTranslation(['applications', 'common']);

  // table data
  const {
    data: organizationApplications,
    isLoading: isApplicationsLoading,
    error: applicationsError,
    refetch: reloadApplications,
  } = useOrganizationApplicationsQuery(organizationId);

  // actions
  const {
    mutateAsync: restore,
    isLoading: isRestoringAppccess,
    error: restoretAccessError,
  } = useRestoreApplicationMutation();

  const {
    mutateAsync: restrict,
    isLoading: isRestrictingAppccess,
    error: restrictAccessError,
  } = useRestrictApplicationMutation();

  useEffect(() => {
    if (organizationApplications) setApplications(organizationApplications);
  }, [organizationApplications]);

  useEffect(() => {
    if (organizationApplications)
      setApplications(
        organizationApplications.filter((app) => app.name.includes(searchWord || '')),
      );
  }, [searchWord]);

  useEffect(() => {
    if (type && organizationApplications) {
      setApplications(organizationApplications.filter((app) => app.type === type?.type));
    }
  }, [type]);

  useEffect(() => {
    if (applicationsError) {
      useErrorToast(t('error.get_applications'));
    }

    if (restoretAccessError) {
      console.log('eroare la restore access');
    }

    if (restrictAccessError) {
      console.log('eroare la restrict access');
    }
  }, [applicationsError, restoretAccessError, restrictAccessError]);

  const buildApplicationActionColumn = (): TableColumn<ApplicationWithOngStatus> => {
    const restrictedApplicationMenu = [
      {
        name: 'Reda accesul',
        icon: RefreshIcon,
        onClick: onActivateApplication,
        type: PopoverMenuRowType.INFO,
      },
      {
        name: 'Elimina definitiv',
        icon: TrashIcon,
        onClick: onRemoveApplication,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    const activeApplicationMenu = [
      {
        name: 'Restrictioneaza temporar',
        icon: BanIcon,
        onClick: onRestrictApplication,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    return {
      name: '',
      cell: (row: ApplicationWithOngStatus) => (
        <PopoverMenu
          row={row}
          menuItems={
            row.status === OngApplicationStatus.ACTIVE
              ? activeApplicationMenu
              : restrictedApplicationMenu
          }
        />
      ),
      width: '50px',
      allowOverflow: true,
    };
  };

  const onActivateApplication = (row: ApplicationWithOngStatus) => {
    restore({ organizationId, applicationId: row.id }, { onSuccess: () => reloadApplications() });
  };

  const onRestrictApplication = (row: ApplicationWithOngStatus) => {
    restrict({ organizationId, applicationId: row.id }, { onSuccess: () => reloadApplications() });
  };

  const onRemoveApplication = (row: ApplicationWithOngStatus) => {
    console.log('to be implemented');
  };

  const onSearch = (searchWord: string) => {
    setSearchWord(searchWord);
  };

  const onTypeChange = (selected: { type: ApplicationTypeEnum; label: string }) => {
    setType(selected);
  };

  const onResetFilters = () => {
    setSearchWord(null);
    setType(null);
    setApplications(organizationApplications || []);
  };

  return (
    <>
      <DataTableFilters
        onSearch={onSearch}
        searchValue={searchWord}
        onResetFilters={onResetFilters}
      >
        <div className="flex gap-x-6">
          <div className="basis-1/4">
            <Select
              config={{
                label: t('app_type'),
                collection: ApplicationTypeCollection,
                displayedAttribute: 'label',
              }}
              selected={type}
              onChange={onTypeChange}
            />
          </div>
        </div>
      </DataTableFilters>
      <div className="w-full bg-white shadow rounded-lg">
        <div className="py-5 px-10 flex items-center justify-between border-b border-gray-200">
          <p className="text-gray-800 font-titilliumBold text-xl">{t('active_apps')}</p>
        </div>
        <div className="pb-5 px-10">
          <DataTableComponent
            columns={[...OrganizationApplicationsTableHeaders, buildApplicationActionColumn()]}
            data={applications}
            loading={isApplicationsLoading || isRestoringAppccess || isRestrictingAppccess}
          />
        </div>
      </div>
    </>
  );
};

export default OrganizationApplicationsTable;
