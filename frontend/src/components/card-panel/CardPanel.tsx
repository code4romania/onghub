import { PencilIcon } from '@heroicons/react/outline';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface CardPanelProps {
  title: string;
  children?: JSX.Element;
  btnLabel?: string;
  loading?: boolean;
  onSave?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const CardPanel = ({ title, children, btnLabel, loading, onSave }: CardPanelProps) => {
  const { t } = useTranslation('common');

  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="py-5 px-10 flex justify-between">
        <span className="font-titilliumBold text-xl text-gray-800">{title}</span>
        {onSave && (
          <button type="button" className="save-button" onClick={onSave} disabled={loading}>
            <PencilIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {loading ? t('processing') : `${btnLabel || t('save')}`}
          </button>
        )}
      </div>

      <div className="w-full border-t border-gray-300" />
      <div className="md:py-5 md:px-10 sm:p-10">{children}</div>
    </div>
  );
};

export default CardPanel;
