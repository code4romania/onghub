import React from 'react';
import { useTranslation } from 'react-i18next';

const EmptyContent = () => {
  const { t } = useTranslation('empty');

  return <span className="p-8 sm:text-sm lg:text-base text-xs">{t('table')}</span>;
};

export default EmptyContent;
