import React from 'react';
import { useTranslation } from 'react-i18next';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import ApplicationListCards from '../apps-store/components/ApplicationListCards';

const AllApps = () => {
  const { t } = useTranslation('appstore');

  return (
    <ContentWrapper title={t('all')} subtitle={t('description')}>
      <ApplicationListCards showAllApps />
    </ContentWrapper>
  );
};

export default AllApps;
