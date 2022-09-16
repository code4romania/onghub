import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { classNames } from '../../common/helpers/tailwind.helper';
import { IPageTab } from '../../common/interfaces/tabs.interface';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import { useAuthContext } from '../../contexts/AuthContext';
import { UserRole } from '../users/enums/UserRole.enum';
import { APPLICATION_STORE_TABS } from './constants/ApplicationStoreTabs.constant';

const AllApplications = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const { role } = useAuthContext();
  const { t } = useTranslation('appstore');

  useEffect(() => {
    const found: IPageTab | undefined = APPLICATION_STORE_TABS.find(
      (tab) => tab.href === location.pathname.split('/')[2],
    );
    if (found) {
      setSelectedTab(found.id);
    }
  }, []);

  const onTabClick = (tab: IPageTab) => {
    setSelectedTab(tab.id);
    navigate(tab.href);
  };

  return (
    <ContentWrapper
      title={t('all')}
      subtitle={t('description')}
      addButton={{
        visible: role === UserRole.SUPER_ADMIN,
        btnLabel: t('add'),
        onBtnClick: () => {
          navigate('new');
        },
      }}
    >
      {role === UserRole.SUPER_ADMIN && (
        <div className="pb-6 flex">
          <nav
            className="flex  pt-6 flex-col space-y-4 sm:space-y-0 sm:gap-x-4 sm:gap-y-4 flex-wrap lg:flex-row cursor-pointer select-none"
            aria-label="Tabs"
          >
            {APPLICATION_STORE_TABS.map((tab) => (
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
      )}
      <Outlet />
    </ContentWrapper>
  );
};

export default AllApplications;
