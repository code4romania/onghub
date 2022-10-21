import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { classNames } from '../../common/helpers/tailwind.helper';
import { IPageTab } from '../../common/interfaces/tabs.interface';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import { Loading } from '../../components/loading/Loading';
import Select from '../../components/Select/Select';
import { useApplicationQuery } from '../../services/application/Application.queries';
import { APPLICATION_TABS } from './constants/ApplicationTabs';

const ApplicationWithOngList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState<{ href: string } | null>({
    href: APPLICATION_TABS.find((item) => item.id === 0)?.href || '',
  });
  const params = useParams();
  const locationLength = location.pathname.split('/').length - 1;

  const {
    data: application,
    isLoading,
    refetch: refecthApplication,
  } = useApplicationQuery(params.id ? params?.id : '');

  useEffect(() => {
    const found: IPageTab | undefined = APPLICATION_TABS.find(
      (tab) => tab.href === location.pathname.split('/')[locationLength],
    );
    if (found) {
      setSelectedTab({ href: found.href });
    }
  }, []);

  useEffect(() => {
    setSelectedTab({ href: location.pathname.split('/')[locationLength] });
  }, [location]);

  const onTabClick = (tab: IPageTab) => {
    setSelectedTab({ href: tab.href });
    navigate(tab.href, { replace: true });
  };

  const onApplicationEdit = () => {
    navigate('edit');
  };

  if (isLoading) {
    return <Loading />;
  }

  const naivgateBack = () => {
    navigate('/all-apps');
  };

  return (
    <ContentWrapper
      title={application?.name || ''}
      backButton={{
        btnLabel: 'Inapoi',
        onBtnClick: naivgateBack,
      }}
      editButton={{
        btnLabel: 'Editeaza',
        onBtnClick: onApplicationEdit,
        visible: true,
      }}
    >
      <div className="pb-6 flex">
        <nav
          className="lg:flex hidden flex-col space-y-4 sm:space-y-0 sm:gap-x-4 sm:gap-y-4 flex-wrap lg:flex-row cursor-pointer select-none"
          aria-label="Tabs"
        >
          {APPLICATION_TABS.map((tab) => (
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
              collection: APPLICATION_TABS,
              displayedAttribute: 'name',
            }}
            selected={selectedTab}
            onChange={onTabClick}
          />
        </span>
      </div>
      <Outlet context={[application, refecthApplication]} />
    </ContentWrapper>
  );
};

export default ApplicationWithOngList;
