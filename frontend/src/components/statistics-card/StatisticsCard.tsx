import React from 'react';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/outline';
import { classNames } from '../../common/helpers/tailwind.helper';
import { useTranslation } from 'react-i18next';

interface StatisticsCardInfo {
  icon: any;
  iconColor?: string;
  title: string;
  count: number;
  movementInTheLastMonth?: number;
}

const StatisticsCard = ({ stat }: { stat: StatisticsCardInfo }) => {
  const { t } = useTranslation('dashboard');

  return (
    <div className="basis-1/3 2xl:basis-1/4 flex grow min-w-[12rem] sm:w-[29rem] w-full max-w-1/3 gap-4 lg:p-5 p-3 bg-white rounded-lg shadow items-center">
      <div className={classNames('bg-green rounded p-2', stat.iconColor)}>
        <stat.icon className="sm:w-7 sm:h-7 lg:w-10 lg:h-10 w-5 h-5 text-white" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-gray-500 wrap sm:text-sm lg:text-base text-xs">{t(stat.title)}</span>
        <div className="flex items-baseline gap-4">
          <span className="text-gray-900 sm:text-2xl lg:text-3xl text-lg">{stat.count}</span>
          {stat.movementInTheLastMonth && (
            <div
              className={classNames(
                stat.movementInTheLastMonth > 0 ? 'bg-green-100' : 'bg-red-100',
                'flex items-center px-2 rounded-lg',
              )}
            >
              {stat.movementInTheLastMonth > 0 ? (
                <ArrowUpIcon className="text-green w-4 h-4" />
              ) : (
                <ArrowDownIcon className="text-red-500 w-4 h-4" />
              )}
              <span
                className={classNames(
                  'sm:text-sm text-xs',
                  stat.movementInTheLastMonth > 0 ? 'text-green-600' : 'text-red-600',
                )}
              >
                {stat.movementInTheLastMonth}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;
