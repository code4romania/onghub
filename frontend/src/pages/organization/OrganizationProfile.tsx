/* eslint-disable no-constant-condition */
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { classNames } from '../../common/helpers/tailwind.helper';
import { useErrorToast } from '../../common/hooks/useToast';
import { useCountiesQuery } from '../../services/nomenclature/Nomenclature.queries';
import { useOrganizationByProfileQuery } from '../../services/organization/Organization.queries';
import { ORGANIZATION_TABS } from './constants/Tabs.constants';
import { IPageTab } from '../../common/interfaces/tabs.interface';
import { useTranslation } from 'react-i18next';
import { UserRole } from '../users/enums/UserRole.enum';
import { AuthContext } from '../../contexts/AuthContext';

const OrganizationProfile = () => {
  const [readonly, setReadonly] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(0);
  const { t } = useTranslation('organization');
  const { role } = useContext(AuthContext);

  // TODO: Load nomenclature data on app init
  useCountiesQuery();

  // load organization data
  const { error } = useOrganizationByProfileQuery();

  useEffect(() => {
    const found: IPageTab | undefined = ORGANIZATION_TABS.find(
      (tab) => tab.href === location.pathname.split('/')[2],
    );
    if (found) {
      setSelectedTab(found.id);
    }
  }, []);

  useEffect(() => {
    if (error) useErrorToast(t('error'));
  }, [error]);

  const onTabClick = (tab: IPageTab) => {
    setSelectedTab(tab.id);
    navigate(tab.href);
  };

  return (
    <div>
      <p className="text-gray-800 font-titilliumBold text-3xl">{t('my_organization')}</p>
      {role !== UserRole.EMPLOYEE && (
        <button type="button" className="red-button">
          {readonly ? t('edit', { ns: 'common' }) : t('save', { ns: 'common' })}
        </button>
      )}
      <p className="text-gray-400 pt-6">{t('description')}</p>
      <div className="pb-6 flex">
        <nav
          className="flex pt-6 flex-col space-y-4 sm:space-y-0 sm:gap-x-4 sm:gap-y-4 flex-wrap lg:flex-row cursor-pointer select-none"
          aria-label="Tabs"
        >
          {ORGANIZATION_TABS.map((tab) => (
            <a
              key={tab.name}
              onClick={() => onTabClick(tab)}
              className={classNames(
                tab.href === location.pathname.split('/')[2]
                  ? 'bg-green-tab text-gray-800 font-titilliumBold'
                  : 'font-titilliumSemiBold',
                'text-gray-700 rounded-md text-xl px-8 py-2 hover:bg-green-tab lg:whitespace-nowrap',
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

export default OrganizationProfile;
