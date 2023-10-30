import React from 'react';
import { useTranslation } from 'react-i18next';

const GenericFormErrorMessage = () => {
  const { t } = useTranslation('common');
  return (
    <span className="lg:text-base text-xs text-red-500 py-2">
      {t('generic_invalid_form_error')}
    </span>
  );
};

export default GenericFormErrorMessage;
