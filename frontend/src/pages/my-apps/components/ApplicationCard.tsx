import React from 'react';
import { ApplicationWithOngStatus } from '../../../services/application/interfaces/Application.interface';
import logo from '../../../assets/images/logo.svg';
import { useNavigate } from 'react-router-dom';
import { OngApplicationStatus } from '../../requests/interfaces/OngApplication.interface';
import { ApplicationTypeEnum } from '../../apps-store/constants/ApplicationType.enum';
import { openInNewTab } from '../../../common/helpers/format.helper';

const ApplicationCard = ({ application }: { application: ApplicationWithOngStatus }) => {
  const navigate = useNavigate();

  const onMore = (e: any) => {
    e.preventDefault();
    navigate(`/application/${application.id}`);
  };

  const onOpen = (e: any) => {
    e.preventDefault();
    if (application.type === ApplicationTypeEnum.INDEPENDENT && application.website) {
      openInNewTab(application.website);
    } else if (application.loginlink) {
      openInNewTab(application.loginlink);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow flex flex-col gap-4 items-center justify-between w-80 h-[28rem] p-8">
      <div className="w-full">
        <img src={application.logo || logo} className="h-full w-full pt-10 pb-10"></img>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <p className="font-titilliumBold text-xl">{application.name}</p>
        <p className="break-word Application__Card__Description"> {application.shortdescription}</p>
      </div>
      <div className="flex gap-4 justify-center w-full">
        <button className="edit-button w-full flex justify-center" onClick={onMore}>
          <p className="text-center">Mai mult</p>
        </button>
        {(application.status === OngApplicationStatus.ACTIVE ||
          application.type === ApplicationTypeEnum.INDEPENDENT) && (
          <button className="save-button w-full flex justify-center" onClick={onOpen}>
            <p className="text-center">Deschide</p>
          </button>
        )}
      </div>
    </div>
  );
};

export default ApplicationCard;
