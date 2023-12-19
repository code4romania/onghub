import React from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from '../../common/helpers/tailwind.helper';

interface StatusRadioComponentProps {
  active: boolean;
  setActive: (active: boolean) => void;
}

const StatusRadioComponent = ({ active, setActive }: StatusRadioComponentProps) => {
  const { t } = useTranslation('common');
  return (
    <div className="border border-gray-200 w-full h-10 rounded-md flex flex-row divide-x divide-gray-200 shadow-sm">
      <div
        className={classNames(
          !active ? 'bg-gray-900 text-white' : '',
          'flex-1 py-2 cursor-pointer rounded-l-md flex items-center justify-center text-sm',
        )}
        onClick={setActive.bind(null, false)}
      >
        {t('inactive')}
      </div>
      <div
        className={classNames(
          active ? 'bg-green text-white' : '',
          'flex-1 py-2 cursor-pointer rounded-r-md flex items-center justify-center text-sm',
        )}
        onClick={setActive.bind(null, true)}
      >
        {t('active')}
      </div>
    </div>
  );
};

export default StatusRadioComponent;
