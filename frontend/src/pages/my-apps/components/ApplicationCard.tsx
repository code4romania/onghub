import React from 'react';
import { ApplicationWithOngStatus } from '../../../services/application/interfaces/Application.interface';
import logo from '../../../assets/images/logo.svg';
import { useNavigate } from 'react-router-dom';
import { OngApplicationStatus } from '../../requests/interfaces/OngApplication.interface';
import { ApplicationTypeEnum } from '../../apps-store/constants/ApplicationType.enum';
import { openInNewTab } from '../../../common/helpers/format.helper';
import { useTranslation } from 'react-i18next';

const ApplicationCard = ({ application }: { application: ApplicationWithOngStatus }) => {
  const navigate = useNavigate();

  const { t } = useTranslation('my_apps');

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
    <div className="bg-white rounded-xl shadow flex flex-col gap-4 items-center justify-between w-80 h-[28rem] p-8 relative overflow-hidden">
      {(application.status === OngApplicationStatus.RESTRICTED ||
        application.status === OngApplicationStatus.DISABLED) && (
        <div className="ribbon">
          <p>Indisponibil</p>
        </div>
      )}
      <div className="w-full max-h-[50%]">
        <img src={application.logo || logo} className="h-full w-full pt-10 pb-10"></img>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <p className="font-titilliumBold text-xl">{application.name}</p>
        <p className="break-word Application__Card__Description"> {application.shortDescription}</p>
      </div>
      <div className="flex gap-4 justify-center w-full">
        <button className="edit-button w-full flex justify-center" onClick={onMore}>
          <p className="text-center">{t('more')}</p>
        </button>
        {(application.status === OngApplicationStatus.ACTIVE ||
          application.type === ApplicationTypeEnum.INDEPENDENT) && (
          <button className="save-button w-full flex justify-center" onClick={onOpen}>
            <p className="text-center">{t('open')}</p>
          </button>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;
