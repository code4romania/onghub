import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { classNames } from '../../common/helpers/tailwind.helper';
import { IPageTab } from '../../common/interfaces/tabs.interface';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import Select from '../../components/Select/Select';
import { useAuthContext } from '../../contexts/AuthContext';
import { USERS_TABS } from './constants/Tabs.constants';
import { UserRole } from './enums/UserRole.enum';

const Users = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState<{ href: string; name: string } | null>({
    href: USERS_TABS.find((item) => item.id === 0)?.href || '',
    name: USERS_TABS.find((item) => item.id === 0)?.name || '',
  });
  const { role } = useAuthContext();
  const { t } = useTranslation('user');
  const locationLength = location.pathname.split('/').length - 1;

  useEffect(() => {
    // TODO: refactor user tabs to have a function that returns this logic.
    const found: IPageTab | undefined = USERS_TABS.find(
      (tab) => tab.href === location.pathname.split('/')[locationLength],
    );
    if (found) {
      setSelectedTab({ href: found.href, name: found.name });
    }
  }, []);

  useEffect(() => {
    const found: IPageTab | undefined = USERS_TABS.find(
      (tab) => tab.href === location.pathname.split('/')[locationLength],
    );
    if (found) {
      setSelectedTab({ href: found.href, name: found.name });
    }
  }, [location]);

  const onTabClick = (tab: IPageTab) => {
    setSelectedTab({ href: tab.href, name: tab.name });
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
          className="lg:flex hidden flex-col space-y-4 sm:space-y-0 sm:gap-x-4 sm:gap-y-4 flex-wrap lg:flex-row cursor-pointer select-none"
          aria-label="Tabs"
        >
          {USERS_TABS.map((tab) => (
            <a
              aria-label={tab.name}
              key={tab.name}
              onClick={() => onTabClick(tab)}
              className={classNames(
                selectedTab?.href === tab.href
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
              collection: USERS_TABS,
              displayedAttribute: 'name',
            }}
            selected={selectedTab}
            onChange={onTabClick}
          />
        </span>
      </div>
      <Outlet />
    </ContentWrapper>
  );
};

export default Users;
