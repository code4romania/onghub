import React from 'react';
import { classNames } from '../../common/helpers/tailwind.helper';
import { Tooltip } from 'react-tooltip';
import colors from 'tailwindcss/colors';

export enum BadgeStatus {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

interface StatusBadgeProps {
  status: BadgeStatus;
  value: string;
  tooltip?: boolean;
  tooltipContent?: string;
}

const StatusBadge = ({ status, value, tooltip, tooltipContent = '' }: StatusBadgeProps) => {
  return (
    <a
      data-tooltip-id={tooltip ? `status-badge-tooltip-${status}-${value}` : undefined}
      className="!p-0"
    >
      <span
        className={classNames(
          'inline-flex items-center px-2.5 py-0.5 rounded-full lg:text-sm text-xs font-medium',
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
      {tooltip && (
        <Tooltip
          id={`status-badge-tooltip-${status}-${value}`}
          place="top"
          content={tooltipContent}
          style={{
            maxWidth: '250px',
            zIndex: 100_000,
            backgroundColor:
              status === BadgeStatus.SUCCESS
                ? colors.green[300]
                : status === BadgeStatus.ERROR
                  ? colors.red[200]
                  : colors.yellow[200],
            color:
              status === BadgeStatus.SUCCESS
                ? colors.green[900]
                : status === BadgeStatus.ERROR
                  ? colors.red[900]
                  : colors.amber[600],
          }}
        />
      )}
    </a>
  );
};

export default StatusBadge;
