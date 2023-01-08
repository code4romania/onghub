import React from 'react';
import { classNames } from '../../common/helpers/tailwind.helper';

export enum BadgeStatus {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

interface StatusBadgeProps {
  status: BadgeStatus;
  value: string;
}

const StatusBadge = ({ status, value }: StatusBadgeProps) => {
  return (
    <span
      className={classNames(
        'inline-flex items-center px-2.5 py-0.5 rounded-full sm:text-sm text-xs font-medium',
        status === BadgeStatus.SUCCESS ? 'bg-green-100 text-green-800' : '',
        status === BadgeStatus.ERROR ? 'bg-red-100 text-red-800' : '',
        status === BadgeStatus.WARNING ? 'bg-yellow-100 text-yellow-800' : '',
      )}
    >
      <svg
        className={classNames(
          'mr-1.5 h-2 w-2 min-w-[0.5rem] min-h-[0.5rem]',
          status === BadgeStatus.SUCCESS ? 'text-green-400' : '',
          status === BadgeStatus.ERROR ? 'text-red-400' : '',
          status === BadgeStatus.WARNING ? 'text-warning-400' : '',
        )}
        fill="currentColor"
        viewBox="0 0 8 8"
      >
        <circle cx={4} cy={4} r={3} />
      </svg>
      {value}
    </span>
  );
};

export default StatusBadge;
