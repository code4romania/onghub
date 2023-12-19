import React from 'react';
import { useTranslation } from 'react-i18next';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import RequestList from './components/RequestList';

const Requests = () => {
  const { t } = useTranslation('requests');

  return (
    <ContentWrapper title={t('title')} subtitle={t('subtitle')}>
      <div className="pb-6 flex w-full">
        <RequestList />
      </div>
    </ContentWrapper>
  );
};

export default Requests;
