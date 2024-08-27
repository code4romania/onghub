/* eslint-disable no-constant-condition */
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { classNames } from '../../common/helpers/tailwind.helper';
import { useErrorToast } from '../../common/hooks/useToast';
import {
  useCountiesQuery,
  useIssuersQuery,
} from '../../services/nomenclature/Nomenclature.queries';
import {
  OrganizationPayload,
  useOrganizationMutation,
  useOrganizationQuery,
} from '../../services/organization/Organization.queries';
import { ORGANIZATION_EXTENDED_TABS } from './constants/Tabs.constants';
import { IPageTab } from '../../common/interfaces/tabs.interface';
import { useTranslation } from 'react-i18next';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import { useSelectedOrganization } from '../../store/selectors';
import Select from '../../components/Select/Select';
import { OrganizationContext } from './interfaces/OrganizationContext';

const Organization = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState<{ href: string; name: string } | null>({
    href: ORGANIZATION_EXTENDED_TABS.find((item) => item.id === 0)?.href || '',
    name: ORGANIZATION_EXTENDED_TABS.find((item) => item.id === 0)?.name || '',
  });
  const { t } = useTranslation('organization');
  const locationLength = location.pathname.split('/').length - 1;

  // TODO: Load nomenclature data on app init
  useCountiesQuery();
  useIssuersQuery();

  // load organization data
  const { error } = useOrganizationQuery(id as string);

  const { mutate: updateOrganization, isLoading } = useOrganizationMutation();

  const { organizationGeneral } = useSelectedOrganization();

  useEffect(() => {
    const found: IPageTab | undefined = ORGANIZATION_EXTENDED_TABS.find(
      (tab) => tab.href === location.pathname.split('/')[locationLength],
    );
    if (found) {
      setSelectedTab({ href: found.href, name: found.name });
    }
  }, []);

  useEffect(() => {
    const found: IPageTab | undefined = ORGANIZATION_EXTENDED_TABS.find(
      (tab) => tab.href === location.pathname.split('/')[locationLength],
    );
    if (found) {
      setSelectedTab({ href: found.href, name: found.name });
    }
  }, [location]);

  useEffect(() => {
    if (error) useErrorToast(t('error'));
  }, [error]);

  const onTabClick = (tab: IPageTab) => {
    setSelectedTab({ href: tab.href, name: tab.name });
    navigate(tab.href);
  };

  const onBackButtonPress = () => {
    navigate('/organizations');
  };

  return (
    <ContentWrapper
      title={organizationGeneral?.name || ''}
      subtitle={t('description_admin')}
      backButton={{
        btnLabel: t('back', { ns: 'common' }),
        onBtnClick: onBackButtonPress,
      }}
    >
      <div className="pb-6 flex">
        <nav
          className="2xl:flex hidden xs:pt-6 pt-0 flex-col flex-wrap space-y-4 sm:space-y-0 sm:gap-x-4 sm:gap-y-4 lg:flex-row cursor-pointer select-none"
          aria-label="Tabs"
        >
          {ORGANIZATION_EXTENDED_TABS.map((tab) => (
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
        <span className="2xl:hidden block w-full max-w-sm">
          <Select
            config={{
              label: '',
              collection: ORGANIZATION_EXTENDED_TABS,
              displayedAttribute: 'name',
            }}
            selected={selectedTab}
            onChange={onTabClick}
          />
        </span>
      </div>
      <Outlet
        context={{ disabled: true, isLoading, updateOrganization } satisfies OrganizationContext}
      />
    </ContentWrapper>
  );
};

export default Organization;
