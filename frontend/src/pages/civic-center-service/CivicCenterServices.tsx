import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { classNames } from '../../common/helpers/tailwind.helper';
import { IPageTab } from '../../common/interfaces/tabs.interface';
import Select from '../../components/Select/Select';
import { SERVICE_TABS } from './constants/Tabs.constants';

const CivicCenterServices = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState<{ href: string; name: string } | null>({
    href: SERVICE_TABS.find((item) => item.id === 0)?.href || '',
    name: SERVICE_TABS.find((item) => item.id === 0)?.name || '',
  });
  const locationLength = location.pathname.split('/').length - 1;

  const { t } = useTranslation('civic-center');

  useEffect(() => {
    // TODO: refactor user tabs to have a function that returns this logic.
    const found: IPageTab | undefined = SERVICE_TABS.find(
      (tab) => tab.href === location.pathname.split('/')[locationLength],
    );
    if (found) {
      setSelectedTab({ href: found.href, name: found.name });
    }
  }, []);

  useEffect(() => {
    const found: IPageTab | undefined = SERVICE_TABS.find(
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
    <section>
      <div className="flex justify-between items-center gap-y-3">
        <div className="flex sm:flex-row flex-col gap-y-4">
          <p className="text-gray-800 font-titilliumBold sm:text-2xl lg:text-3xl text-lg self-center">
            {t('my_services')}
          </p>
        </div>
      </div>
      <p className="text-gray-400 lg:pt-6 pt-3 sm:text-sm lg:text-base text-xs">
        {t('description')}
      </p>
      <div className="py-1 md:py-3 lg:py-6">
        <div className="flex">
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
      </div>
      <Outlet />
    </section>
  );
};

export default CivicCenterServices;
