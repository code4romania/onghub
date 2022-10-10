/* eslint-disable no-constant-condition */
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { classNames } from '../../common/helpers/tailwind.helper';
import { useErrorToast } from '../../common/hooks/useToast';
import { useCountiesQuery } from '../../services/nomenclature/Nomenclature.queries';
import { useOrganizationQuery } from '../../services/organization/Organization.queries';
import { ORGANIZATION_EXTENDED_TABS } from './constants/Tabs.constants';
import { IPageTab } from '../../common/interfaces/tabs.interface';
import { useTranslation } from 'react-i18next';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import { useSelectedOrganization } from '../../store/selectors';

const Organization = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const { t } = useTranslation('organization');

  // TODO: Load nomenclature data on app init
  useCountiesQuery();

  // load organization data
  const { error } = useOrganizationQuery(id as string);

  const { organizationGeneral } = useSelectedOrganization();

  useEffect(() => {
    const found: IPageTab | undefined = ORGANIZATION_EXTENDED_TABS.find(
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

  const onBackButtonPress = () => {
    navigate('/organizations');
  };

  return (
    <ContentWrapper
      title={organizationGeneral?.name || ''}
      subtitle={t('description')}
      backButton={{
        btnLabel: t('back', { ns: 'common' }),
        onBtnClick: onBackButtonPress,
      }}
    >
      <div className="-mt-6 pb-6 flex">
        <nav
          className="flex pt-6 flex-col space-y-4 sm:space-y-0 sm:gap-x-4 sm:gap-y-4 flex-wrap lg:flex-row cursor-pointer select-none"
          aria-label="Tabs"
        >
          {ORGANIZATION_EXTENDED_TABS.map((tab) => (
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

export default Organization;
