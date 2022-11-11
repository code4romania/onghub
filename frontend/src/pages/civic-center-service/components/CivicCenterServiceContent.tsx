import React from 'react';
import { LocationMarkerIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { CivicCenterService } from '../../../services/civic-center-service/interfaces/civic-center-service.interface';
import { useTranslation } from 'react-i18next';
import {
  calculatePeriod,
  dataToCsv,
  formatAgeCategories,
} from '../../../common/helpers/pulling-apps-helper';

interface CivicCenterServiceContentProps {
  service: CivicCenterService;
}

interface CivicCenterAccessDetailProps {
  title: string;
  description: string;
}

interface CivicCenterAccessDetailsRowProps {
  label: string;
  value?: string;
}

const CivicCenterAccessDetail = ({ title, description }: CivicCenterAccessDetailProps) => (
  <div className="pb-4">
    <h4 className="flex items-center  justify-start gap-2">
      <CheckCircleIcon className="w-5 h-5 text-green" />
      <span className="font-titilliumBold text-base text-gray-800">{title}</span>
    </h4>
    <p className="font-normal text-sm text-gray-500">{description}</p>
  </div>
);

const CivicCenterAccessDetailsRow = ({ label, value }: CivicCenterAccessDetailsRowProps) => (
  <div className="flex flex-row items-center justify-start gap-2 text-base">
    <span className="font-titilliumBold text-gray-600">{label}</span>
    <span className="font-titillium">{value}</span>
  </div>
);

const CivicCenterServiceContent = ({ service }: CivicCenterServiceContentProps) => {
  const { t } = useTranslation(['civic_center_service']);

  return (
    <section className="divide-y divide-gray-100">
      <div className="flex flex-col gap-2 pb-8">
        <p className="flex font-titilliumSemiBold text-base items-center gap-2">
          <LocationMarkerIcon className="h-4 w-4" />
          <span>{service.location.name}</span>
        </p>
        <h3 className="font-titilliumBold text-2xl">{service.name}</h3>
        <div className="flex flex-col gap-4 font-titillium text-base">
          <p>{service?.shortDescription}</p>
          <p>{service?.longDescription}</p>
        </div>
        <div className="flex flex-col gap-2 md:gap-4 md:flex-row md:flex-wrap">
          <CivicCenterAccessDetailsRow
            label={t('details.available')}
            value={calculatePeriod(service)}
          />
          <CivicCenterAccessDetailsRow
            label={t('details.age_category')}
            value={formatAgeCategories(service)}
          />
          <CivicCenterAccessDetailsRow
            label={t('details.domains')}
            value={dataToCsv(service.domains)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 py-8 xl:flex-row">
        {service?.hasOnlineAccess && (
          <div className="flex-1 flex flex-col gap-2 xl:max-w-[30%]">
            <CivicCenterAccessDetail
              title={t('details.access.online.title')}
              description={t('details.access.online.description')}
            />
          </div>
        )}
        {service?.hasEmailPhoneAccess && (
          <div className="flex-1 flex flex-col gap-2 xl:max-w-[30%]">
            <CivicCenterAccessDetail
              title={t('details.access.email_or_phone.title')}
              description={t('details.access.email_or_phone.description')}
            />
            <CivicCenterAccessDetailsRow label={t('details.email')} value={service.emailAccess} />
            <CivicCenterAccessDetailsRow label={t('details.phone')} value={service.phoneAccess} />
          </div>
        )}
        {service?.hasPhysicalAccess && (
          <div className="flex-1 flex flex-col gap-2 xl:max-w-[30%]">
            <CivicCenterAccessDetail
              title={t('details.access.physical.title')}
              description={t('details.access.physical.description')}
            />
            <CivicCenterAccessDetailsRow
              label={t('details.address')}
              value={service.physicalAccessAddress}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default CivicCenterServiceContent;
