import React from 'react';
import { useTranslation } from 'react-i18next';

const EmptyContent = () => {
  const { t } = useTranslation('empty');

  return <span>{t('table')}</span>;
};

export default EmptyContent;
