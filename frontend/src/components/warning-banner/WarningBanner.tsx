import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

interface WarningBannerProps {
  text: string;
  actionText?: string;
  actionLink?: string;
}
const WarningBanner = ({ text, actionText, actionLink }: WarningBannerProps) => {
  return (
    <div className="bg-amber-50 flex flex-row items-center gap-2">
      <div className="bg-yellow-700 w-1 self-stretch"></div>
      <ExclamationTriangleIcon width={16} height={16} fill="rgb(251 192 45)" />
      <p className="py-3 text-amber-800 text-xs">
        {text}{' '}
        {actionText && (
          <a
            href={actionLink}
            className="text-amber-800 hover:text-amber-700 underline underline-offset-2"
          >
            {actionText}
          </a>
        )}
      </p>
    </div>
  );
};

export default WarningBanner;
