import React from 'react';
import LoadingContent from '../data-table/LoadingContent';
import { useTranslation } from 'react-i18next';

export const Loading = () => {
  const { t } = useTranslation('common');

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
      <LoadingContent /> <span>{t('loading')}</span>
    </div>
  );
};
