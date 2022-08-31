import React from 'react';
import { Application } from '../../../services/application/interfaces/Application.interface';
import logo from '../../../assets/images/logo.svg';

const ApplicationCard = ({ application }: { application: Application }) => {
  return (
    <div className="bg-white rounded shadow flex flex-col gap-4 items-center w-80 h-[28rem]">
      <div className="w-full">
        <img src={application.logo || logo} className="h-full w-full pt-10 pb-10"></img>
      </div>
      <div className="flex flex-col gapr-4 w-full">
        <p>Date ONG</p>
        <p>{application.shortDescription}</p>
      </div>
      <div className="flex gap-4">
        <button className="edit-button">Mai mult</button>
        <button className="save-button">Deschide</button>
      </div>
    </div>
  );
};

export default ApplicationCard;
