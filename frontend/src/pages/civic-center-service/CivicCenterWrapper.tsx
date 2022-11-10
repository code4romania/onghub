import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { classNames } from '../../common/helpers/tailwind.helper';
import { IPageTab } from '../../common/interfaces/tabs.interface';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import Select from '../../components/Select/Select';
import { SERVICE_TABS } from './constants/Tabs.constants';

const CivicCenterWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState<IPageTab | null>(
    SERVICE_TABS.find((item) => item.id === 0) || null,
  );
  const locationLength = location.pathname.split('/').length - 1;

  const { t } = useTranslation('civic_center_service');

  useEffect(() => {
    // TODO: refactor user tabs to have a function that returns this logic.
    const found: IPageTab | undefined = SERVICE_TABS.find(
      (tab) => tab.href === location.pathname.split('/')[locationLength],
    );
    if (found) {
      setSelectedTab(found);
    }
  }, []);

  useEffect(() => {
    const found: IPageTab | undefined = SERVICE_TABS.find(
      (tab) => tab.href === location.pathname.split('/')[locationLength],
    );
    if (found) {
      setSelectedTab(found);
    }
  }, [location]);

  const onTabClick = (tab: IPageTab) => {
    setSelectedTab(tab);
    navigate(tab.href);
  };

  const onAddCivicCenterService = () => {
    navigate('add');
  };

  return (
    <ContentWrapper
      title={t('wrapper.title')}
      subtitle={t('wrapper.description')}
      addButton={{
        btnLabel: t('wrapper.add_button'),
        onBtnClick: onAddCivicCenterService,
        visible: true,
      }}
    >
      <div className="flex pb-6">
        <nav
          className="lg:flex hidden flex-col space-y-4 sm:space-y-0 sm:gap-x-4 sm:gap-y-4 flex-wrap lg:flex-row cursor-pointer select-none"
          aria-label="Tabs"
        >
          {SERVICE_TABS.map((tab) => (
            <a
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
              collection: SERVICE_TABS,
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

export default CivicCenterWrapper;
