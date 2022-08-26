import { ChevronLeftIcon, PlusIcon } from '@heroicons/react/outline';
import React from 'react';

interface ContentWrapperProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  btnLabel?: string;
  onBtnClick?: () => void;
  goBack?: () => void;
}

const ContentWrapper = ({
  title,
  subtitle,
  children,
  btnLabel,
  onBtnClick,
  goBack,
}: ContentWrapperProps) => {
  return (
    <section>
      <div className="flex items-center justify-between">
        <div className="flex ">
          {goBack && (
            <button
              className="back-button flex items-center justify-center"
              type="button"
              onClick={goBack}
            >
              <ChevronLeftIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
              {'Inapoi'}
            </button>
          )}
          <p className="text-gray-800 font-titilliumBold text-3xl">{title}</p>
        </div>
        {onBtnClick && btnLabel && (
          <button type="button" className="save-button" onClick={onBtnClick}>
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {btnLabel}
          </button>
        )}
      </div>
      <p className="text-gray-400 pt-6">{subtitle}</p>
      <div className="py-6">{children}</div>
    </section>
  );
};

export default ContentWrapper;
