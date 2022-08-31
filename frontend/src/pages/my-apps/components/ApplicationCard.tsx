import React from 'react';
import { Application } from '../../../services/application/interfaces/Application.interface';
import logo from '../../../assets/images/logo.svg';
import { useNavigate } from 'react-router-dom';

const ApplicationCard = ({ application }: { application: Application }) => {
  const navigate = useNavigate();

  const onMore = (e: any) => {
    e.preventDefault();
    navigate(`/application/${application.id}`);
  };

  const onOpen = (e: any) => {
    e.preventDefault();
    if (application.loginLink) {
      window.location.href = application.loginLink;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow flex flex-col gap-4 items-center justify-between w-80 h-[28rem] p-8">
      <div className="w-full">
        <img src={application.logo || logo} className="h-full w-full pt-10 pb-10"></img>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <p className="font-titilliumBold text-xl">Date ONG</p>
        <p className="break-word Application__Card__Description"> {application.shortDescription}</p>
      </div>
      <div className="flex gap-4">
        <button className="edit-button px-6" onClick={onMore}>
          Mai mult
        </button>
        <button className="save-button px-6" onClick={onOpen}>
          Deschide
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
