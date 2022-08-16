/* eslint-disable no-constant-condition */
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { classNames } from '../../common/helpers/tailwind.helper';
import { useErrorToast } from '../../common/hooks/useToast';
import { useCountiesQuery } from '../../services/nomenclature/Nomenclature.queries';
import { useOrganizationQuery } from '../../services/organization/Organization.queries';
import { useSelectedOrganization } from '../../store/selectors';
import { ORGANIZATION_TABS } from './constants/Tabs.constants';
import { IPageTab } from '../../common/interfaces/tabs.interface';
import { ExclamationIcon } from '@heroicons/react/solid';
import { CheckIcon, XIcon } from '@heroicons/react/outline';
import { OrganizationStatus } from './enums/OrganizationStatus.enum';

const Organization = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const { organization } = useSelectedOrganization();

  // TODO: Load nomenclature data on app init
  useCountiesQuery();

  // load organization data
  const { error } = useOrganizationQuery(params.id ? +params.id : (organization?.id as number));

  useEffect(() => {
    const found: IPageTab | undefined = ORGANIZATION_TABS.find(
      (tab) => tab.href === location.pathname.split('/')[2],
    );
    if (found) {
      setSelectedTab(found.id);
    }
  }, []);

  useEffect(() => {
    if (error) useErrorToast('Could not load Organization');
  }, [error]);

  const onTabClick = (tab: IPageTab) => {
    setSelectedTab(tab.id);
    navigate(tab.href);
  };

  return (
    <div>
      <p className="text-gray-800 font-titilliumBold text-3xl">Organizatia mea</p>
      <p className="text-gray-400 pt-6">
        Administrează de aici profilul tău de organizație pentru a putea accesa aplicațiile
        disponibile.
      </p>
      {organization?.status === OrganizationStatus.PENDING && (
        <div className="w-full bg-white shadow rounded-lg py-5 px-10 flex justify-between items-center flex-col sm:flex-row mt-4">
          <div className="flex gap-4">
            <ExclamationIcon className="text-orange h-7 w-7" />
            <p className="text-gray-800 font-titilliumBold rounded-md  text-xl hover:bg-green-tab lg:whitespace-nowrap">
              Datele de mai jos corespund unei solicitari in curs de aprobare.
            </p>
          </div>
          <div className="flex gap-4">
            <button type="button" className="red-button gap-2">
              <XIcon className="w-5 h-5" /> Respinge
            </button>
            <button type="button" className="save-button gap-2">
              <CheckIcon className="w-5 h-5" /> Aproba
            </button>
          </div>
        </div>
      )}
      <div className="pb-6 flex">
        <nav
          className="flex  pt-6 flex-col space-y-4 sm:space-y-0 sm:gap-x-4 sm:gap-y-4 flex-wrap lg:flex-row cursor-pointer select-none"
          aria-label="Tabs"
        >
          {ORGANIZATION_TABS.map((tab) => (
            <a
              key={tab.name}
              onClick={() => onTabClick(tab)}
              className={classNames(
                selectedTab === tab.id
                  ? 'bg-green-tab text-gray-800 font-titilliumBold'
                  : 'font-titilliumSemiBold',
                'text-gray-700 rounded-md  text-xl px-8 py-2 hover:bg-green-tab lg:whitespace-nowrap',
              )}
            >
              {tab.name}
            </a>
          ))}
        </nav>
      </div>
      <Outlet />
    </div>
  );
};

export default Organization;
