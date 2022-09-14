import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { classNames } from '../../common/helpers/tailwind.helper';
import { IPageTab } from '../../common/interfaces/tabs.interface';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import { useAuthContext } from '../../contexts/AuthContext';
import { USERS_TABS } from './constants/Tabs.constants';
import { UserRole } from './enums/UserRole.enum';

const Users = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(0);
  const { role } = useAuthContext();
  const { t } = useTranslation('user');

  useEffect(() => {
    // TODO: refactor user tabs to have a function that returns this logic.
    const found: IPageTab | undefined = USERS_TABS.find(
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
      title={t('title')}
      subtitle={t('subtitle')}
      addButton={{
        btnLabel: t('add'),
        onBtnClick: () => navigate('/user'),
        visible: role === UserRole.ADMIN,
      }}
    >
      <div className="pb-6 flex">
        <nav
          className="flex flex-col space-y-4 sm:space-y-0 sm:gap-x-4 sm:gap-y-4 flex-wrap lg:flex-row cursor-pointer select-none"
          aria-label="Tabs"
        >
          {USERS_TABS.map((tab) => (
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
    </ContentWrapper>
  );
};

export default Users;
