import React from 'react';
import {
  ApplicationStatus,
  ApplicationWithOngStatus,
} from '../../../services/application/interfaces/Application.interface';
import logo from '../../../assets/images/logo.svg';
import { useNavigate } from 'react-router-dom';
import { OngApplicationStatus } from '../../requests/interfaces/OngApplication.interface';
import { ApplicationTypeEnum } from '../../apps-store/constants/ApplicationType.enum';
import { openInNewTab } from '../../../common/helpers/format.helper';
import { useTranslation } from 'react-i18next';

const ApplicationCard = ({ application }: { application: ApplicationWithOngStatus }) => {
  const navigate = useNavigate();

  const { t } = useTranslation(['my_apps', 'common']);

  const onMore = (e: any) => {
    e.preventDefault();
    navigate(`/application/${application.id}`);
  };

  const onOpen = (e: any) => {
    e.preventDefault();
    if (application.type === ApplicationTypeEnum.INDEPENDENT && application.website) {
      openInNewTab(application.website);
    } else if (application.loginLink) {
      openInNewTab(application.loginLink);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow flex flex-col gap-1 items-center justify-between lg:p-8 p-5 relative overflow-auto sm:min-h-[28rem] w-full">
      {(application.ongStatus === OngApplicationStatus.RESTRICTED ||
        application.status === ApplicationStatus.DISABLED) && (
        <div className="ribbon lg:-left-14 -left-16">
          <p className="sm:text-sm lg:text-base text-xs">{t('unavailable', { ns: 'common' })}</p>
        </div>
      )}
      {application.ongStatus === OngApplicationStatus.PENDING_REMOVAL &&
        application.status !== ApplicationStatus.DISABLED && (
          <div className="ribbon lg:-left-14 -left-16">
            <p className="sm:text-sm lg:text-base text-xs">
              {t('to_be_removed', { ns: 'common' })}
            </p>
          </div>
        )}
      <img
        alt="Application logo"
        src={application.logo || logo}
        className="sm:h-full max-h-32 w-full object-contain"
      ></img>
      <div className="flex flex-col gap-4 w-full">
        <p
          title={application.name}
          className="font-titilliumBold sm:text-lg lg:text-xl text-md pt-2"
        >
          {application.name}
        </p>
        <p
          title={application.shortDescription}
          className="break-word Application__Card__Description sm:text-sm lg:text-base text-xs mb-3"
        >
          {' '}
          {application.shortDescription}
        </p>
      </div>
      <div className="flex gap-4 justify-center w-full">
        <button
          aria-label={t('more')}
          className="edit-button w-full flex justify-center sm:text-sm lg:text-base text-xs"
          onClick={onMore}
        >
          <p className="text-center">{t('more')}</p>
        </button>
        {(application.ongStatus === OngApplicationStatus.ACTIVE ||
          application.type === ApplicationTypeEnum.INDEPENDENT) &&
          application.status !== ApplicationStatus.DISABLED && (
            <button
              aria-label={t('open')}
              className="save-button w-full flex justify-center sm:text-sm lg:text-base text-xs"
              onClick={onOpen}
            >
              <p className="text-center">{t('open')}</p>
            </button>
          )}
      </div>
    </div>
  );
};

export default ApplicationCard;
