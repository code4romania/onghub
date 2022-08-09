import { ChevronLeftIcon } from '@heroicons/react/outline';
import React from 'react';

interface ContentWrapperProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  goBack?: () => void;
}

const ContentWrapper = ({ title, subtitle, children, goBack }: ContentWrapperProps) => {
  return (
    <section>
      <div className="flex">
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
      <p className="text-gray-400 pt-6">{subtitle}</p>
      {children}
    </section>
  );
};

export default ContentWrapper;
