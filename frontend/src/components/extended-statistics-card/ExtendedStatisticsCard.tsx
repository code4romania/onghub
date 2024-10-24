import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../common/helpers/tailwind.helper';
import { getYear } from 'date-fns';

interface ExtendedStatisticsCardInfo {
  icon: any;
  alert?: boolean;
  info: {
    title: string | number;
    subtitle: string;
  }[];
  button?: {
    href: string;
    label: string;
  };
}

const ExetendedStatisticsCard = ({ stat }: { stat: ExtendedStatisticsCardInfo }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['dashboard']);

  const navigateToLink = () => {
    if (stat.button?.href) {
      navigate(stat.button.href);
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-white rounded-xl shadow w-full justify-between">
      <div className="flex gap-4 sm:p-6 p-3 items-start">
        <div className={classNames('bg-green rounded p-3', stat.alert && 'bg-orange')}>
          <stat.icon className={classNames('sm:w-6 sm:h-6 lg:w-7 lg:h-7 w-5 h-5 text-white')} />
        </div>
        <div className="flex flex-col sm:gap-8 gap-4">
          {stat.info.map((row, key) => (
            <div key={key} className="flex flex-col gap-1">
              <span className="text-gray-900 wrap sm:text-lg lg:text-xl text-md">
                {t(row.title.toString())}
              </span>
              <span className="text-gray-500 wrap sm:text-sm lg:text-base text-xs">
                {t(row.subtitle, {
                  value:
                    row.subtitle === 'statistics.next_update'
                      ? getYear(new Date())
                      : row.subtitle === 'statistics.next_year_update'
                        ? getYear(new Date()) + 1
                        : undefined,
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
      {stat.button && (
        <div
          onClick={() => navigateToLink()}
          className="bg-gray-50 p-4 rounded-b-xl hover:bg-gray-100 hover:cursor-pointer sm:text-sm lg:text-base text-xs"
        >
          <span>{t(stat.button?.label)}</span>
        </div>
      )}
    </div>
  );
};

export default ExetendedStatisticsCard;
