import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useErrorToast } from '../../../../common/hooks/useToast';
import DataTableFilters from '../../../../components/data-table-filters/DataTableFilters';
import Select from '../../../../components/Select/Select';
import { useOrganizationApplicationsQuery } from '../../../../services/organization/Organization.queries';
import {
  ApplicationTypeCollection,
  ApplicationTypeEnum,
} from '../../../apps-store/constants/ApplicationType.enum';
import OrganizationApplicationAccessRequestTable from './OrganizationApplicationAccessRequestTable';
import OrganizationApplicationsTable from './OrganizationApplicationsTable';

const OrganizationApplications = () => {
  const { id } = useParams();

  const [searchWord, setSearchWord] = useState<string | null>(null);
  const [type, setType] = useState<{ type: ApplicationTypeEnum; label: string } | null>();

  const { t } = useTranslation(['applications', 'common']);

  // table data
  const {
    data: applications,
    isLoading: isApplicationsLoading,
    error: applicationsError,
    refetch: reloadApplications,
  } = useOrganizationApplicationsQuery(
    id as string,
    searchWord as string,
    type?.type as ApplicationTypeEnum,
  );

  useEffect(() => {
    if (applicationsError) {
      useErrorToast(t('error.get_applications'));
    }
  }, [applicationsError]);

  const onSearch = (searchWord: string) => {
    setSearchWord(searchWord);
  };

  const onTypeChange = (selected: { type: ApplicationTypeEnum; label: string }) => {
    setType(selected);
  };

  const onResetFilters = () => {
    setSearchWord(null);
    setType(null);
  };

  return (
    <div className="w-full h-full flex flex-col gap-5">
      <DataTableFilters
        onSearch={onSearch}
        searchValue={searchWord}
        onResetFilters={onResetFilters}
      >
        <div className="flex gap-x-6">
          <div className="sm:basis-1/4 w-full">
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
      <OrganizationApplicationsTable
        organizationId={id as string}
        isApplicationsLoading={isApplicationsLoading}
        applications={applications}
        reloadApplications={reloadApplications}
      />
      <OrganizationApplicationAccessRequestTable
        organizationId={id as string}
        reloadApplications={reloadApplications}
      />
    </div>
  );
};

export default OrganizationApplications;
