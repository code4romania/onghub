import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { classNames } from '../../common/helpers/tailwind.helper';
import { IPageTab } from '../../common/interfaces/tabs.interface';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import { Loading } from '../../components/loading/Loading';
import { useAuthContext } from '../../contexts/AuthContext';
import { useApplicationQuery } from '../../services/application/Application.queries';
import { UserRole } from '../users/enums/UserRole.enum';
import { APPLICATION_TABS } from './constants/ApplicationTabs';

const Application = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState(0);
  const { role } = useAuthContext();
  const params = useParams();

  const {
    data: application,
    isLoading,
    refetch: refecthApplication,
  } = useApplicationQuery(params.id ? params?.id : '');

  useEffect(() => {
    const found: IPageTab | undefined = APPLICATION_TABS.find(
      (tab) => tab.href === location.pathname.split('/')[2],
    );
    if (found) {
      setSelectedTab(found.id);
    }
  }, []);

  const onTabClick = (tab: IPageTab) => {
    setSelectedTab(tab.id);
    navigate(tab.href, { replace: true });
  };

  const onApplicationEdit = () => {
    navigate('edit');
  };

  if (isLoading) {
    return <Loading />;
  }

  const naivgateBack = () => {
    // TEMPORARY - needs changes
    navigate(-2);
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
        visible: role === UserRole.SUPER_ADMIN,
      }}
    >
      <div className="pb-6 flex">
        {role === UserRole.SUPER_ADMIN && (
          <nav
            className="flex flex-col space-y-4 sm:space-y-0 sm:gap-x-4 sm:gap-y-4 flex-wrap lg:flex-row cursor-pointer select-none"
            aria-label="Tabs"
          >
            {APPLICATION_TABS.map((tab) => (
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
        )}
      </div>
      <Outlet context={[application, refecthApplication]} />
    </ContentWrapper>
  );
};

export default Application;
