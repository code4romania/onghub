import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { useCountiesQuery } from '../../services/nomenclature/Nomenclature.queries';
import { IOrganizationActivity } from '../organization/interfaces/OrganizationActivity.interface';
import { IOrganizationGeneral } from '../organization/interfaces/OrganizationGeneral.interface';
import { IOrganizationLegal } from '../organization/interfaces/OrganizationLegal.interface';

const CreateOrganization = () => {
  const [organization, setOrganization] = useState<{
    general: IOrganizationGeneral | null;
    activity: IOrganizationActivity | null;
    legal: IOrganizationLegal | null;
  }>({ general: null, activity: null, legal: null });

  useCountiesQuery();

  return (
    <div className="w-screen h-screen max-w-full ">
      <Header />
      <div className="flex p-6">
        <div className="content overflow-scroll w-full pl-6">
          <Outlet context={[organization, setOrganization]} />
        </div>
      </div>
    </div>
  );
};

export default CreateOrganization;
