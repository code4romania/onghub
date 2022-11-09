import React from 'react';
import { useTranslation } from 'react-i18next';
import { Loading } from '../../components/loading/Loading';
import { useCivicCenterServicesQuery } from '../../services/civic-center-service/CivicCenterService.queries';

const CivicCenterServiceList = () => {
  // translations
  const { t } = useTranslation(['civic_center_service', 'common']);

  const { isLoading, data: services, error } = useCivicCenterServicesQuery();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <p>{t('list.error')}</p>;
  }

  return <div>{JSON.stringify(services)}</div>;
};

export default CivicCenterServiceList;
