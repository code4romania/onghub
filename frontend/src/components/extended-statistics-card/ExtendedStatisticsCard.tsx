import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../common/helpers/tailwind.helper';

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
    <div className="flex flex-col gap-4 bg-white rounded-xl shadow w-full">
      <div className="flex gap-4 p-6 items-start">
        <div className={classNames('bg-green rounded p-2', stat.alert && 'bg-orange')}>
          <stat.icon className={classNames('w-10 h-10 text-white')} />
        </div>
        <div className="flex flex-col gap-8">
          {stat.info.map((row, key) => (
            <div key={key} className="flex flex-col gap-1">
              <span className="text-gray-900 wrap text-3xl">{t(row.title.toString())}</span>
              <span className="text-gray-500 wrap">{t(row.subtitle)}</span>
            </div>
          ))}
        </div>
      </div>
      {stat.button && (
        <div
          onClick={() => navigateToLink()}
          className="bg-gray-50 p-4 rounded-b-xl hover:bg-gray-100 hover:cursor-pointer"
        >
          <span>{t(stat.button?.label)}</span>
        </div>
      )}
    </div>
  );
};

export default ExetendedStatisticsCard;
