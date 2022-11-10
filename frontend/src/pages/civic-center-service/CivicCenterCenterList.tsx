import React from 'react';
import { useTranslation } from 'react-i18next';
import { Loading } from '../../components/loading/Loading';
import { useCivicCenterServicesQuery } from '../../services/civic-center-service/CivicCenterService.queries';
import CivicCenterServiceActions from './components/CivicCenterServiceActions';
import CivicCenterServiceContent from './components/CivicCenterServiceContent';

const CivicCenterServiceList = () => {
  // translations
  const { t } = useTranslation(['civic_center_service', 'common']);

  const { isLoading, data: services, error, refetch } = useCivicCenterServicesQuery();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <p>{t('list.error')}</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      {services &&
        services.map((service) => (
          <div
            key={service.id}
            className="w-full h-full bg-white shadow rounded-lg p-10 flex flex-col md:flex-row"
          >
            <div className="md:flex-2 xl:flex-3">
              <CivicCenterServiceContent service={service} />
            </div>
            <div className="md:flex-1">
              <CivicCenterServiceActions service={service} refetch={refetch} />
            </div>
          </div>
        ))}
      {!services && !error && <p>{t('no_data', { ns: 'common' })}</p>}
    </div>
  );
};

export default CivicCenterServiceList;
