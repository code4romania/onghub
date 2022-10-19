import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { classNames } from '../../common/helpers/tailwind.helper';
import { IPageTab } from '../../common/interfaces/tabs.interface';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import Select from '../../components/Select/Select';
import { useAuthContext } from '../../contexts/AuthContext';
import { UserRole } from '../users/enums/UserRole.enum';
import { APPLICATION_STORE_TABS } from './constants/ApplicationStoreTabs.constant';

const AllApplications = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<{ id: number; name: string } | null>({
    id: 0,
    name: APPLICATION_STORE_TABS.find((item) => item.id === 0)?.name || '',
  });
  const { role } = useAuthContext();
  const { t } = useTranslation('appstore');

  useEffect(() => {
    const found: IPageTab | undefined = APPLICATION_STORE_TABS.find(
      (tab) => tab.href === location.pathname.split('/')[2],
    );
    if (found) {
      setSelectedTab({ id: found.id, name: found.name });
    }
  }, []);

  const onTabClick = (tab: IPageTab) => {
    setSelectedTab({ id: tab.id, name: tab.name });
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
            className="lg:flex hidden xs:pt-6 pt-0 flex-col space-y-4 sm:space-y-0 sm:gap-x-4 sm:gap-y-4 flex-wrap lg:flex-row cursor-pointer select-none"
            aria-label="Tabs"
          >
            {APPLICATION_STORE_TABS.map((tab) => (
              <a
                key={tab.name}
                onClick={() => onTabClick(tab)}
                className={classNames(
                  selectedTab?.id === tab.id
                    ? 'bg-green-tab text-gray-800 font-titilliumBold'
                    : 'font-titilliumSemiBold',
                  'text-gray-700 rounded-md sm:text-lg lg:text-xl text-md px-8 py-2 hover:bg-green-tab lg:whitespace-nowrap',
                )}
              >
                {tab.name}
              </a>
            ))}
          </nav>
          <span className="lg:hidden block w-full max-w-sm">
            <Select
              config={{
                label: '',
                collection: APPLICATION_STORE_TABS,
                displayedAttribute: 'name',
              }}
              selected={selectedTab}
              onChange={onTabClick}
            />
          </span>
        </div>
      )}
      <Outlet />
    </ContentWrapper>
  );
};

export default AllApplications;
