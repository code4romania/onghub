import React from 'react';
import { useTranslation } from 'react-i18next';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import ApplicationListCards from '../apps-store/components/ApplicationListCards';

const MyApps = () => {
  const { t } = useTranslation('my_apps');

  return (
    <ContentWrapper title={t('title')} subtitle={t('subtitle')}>
      <ApplicationListCards isOngView={true} />
    </ContentWrapper>
  );
};

export default MyApps;
