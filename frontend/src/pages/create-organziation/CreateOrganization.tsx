import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { useCountiesQuery } from '../../services/nomenclature/Nomenclature.queries';

const CreateOrganization = () => {
  useCountiesQuery();
  return (
    <div className="w-screen h-screen max-w-full ">
      <Header />
      <div className="flex p-6">
        <div className="content overflow-scroll w-full pl-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CreateOrganization;
