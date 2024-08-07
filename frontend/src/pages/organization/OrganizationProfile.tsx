/* eslint-disable no-constant-condition */
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { classNames } from '../../common/helpers/tailwind.helper';
import { useErrorToast, useSuccessToast } from '../../common/hooks/useToast';
import { useCountiesQuery, useIssuersQuery } from '../../services/nomenclature/Nomenclature.queries';
import {
  useOrganizationByProfileMutation,
  useOrganizationByProfileQuery,
} from '../../services/organization/Organization.queries';
import { ORGANIZATION_TABS } from './constants/Tabs.constants';
import { IPageTab } from '../../common/interfaces/tabs.interface';
import { useTranslation } from 'react-i18next';
import { UserRole } from '../users/enums/UserRole.enum';
import { useAuthContext } from '../../contexts/AuthContext';
import ConfirmationModal from '../../components/confim-removal-modal/ConfirmationModal';
import { useRestrictOrganizationRequestMutation } from '../../services/organization/Organization.queries';
import { useSelectedOrganization } from '../../store/selectors';
import Select from '../../components/Select/Select';

const OrganizationProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState<{ href: string; name: string } | null>({
    href: ORGANIZATION_TABS.find((item) => item.id === 0)?.href || '',
    name: ORGANIZATION_TABS.find((item) => item.id === 0)?.name || '',
  });
  const { t } = useTranslation('organization');
  const { role } = useAuthContext();
  const [isOrganizationDeleteModalOpen, setOrganizationDeleteModal] = useState(false);
  const locationLength = location.pathname.split('/').length - 1;

  // TODO: Load nomenclature data on app init
  useCountiesQuery();
  useIssuersQuery();

  const { isLoading, mutate: updateOrganization } = useOrganizationByProfileMutation();

  // load organization data
  const { error } = useOrganizationByProfileQuery();

  const restrictOrganizationRequestMutation = useRestrictOrganizationRequestMutation();

  const { organization } = useSelectedOrganization();

  useEffect(() => {
    const found: IPageTab | undefined = ORGANIZATION_TABS.find(
      (tab) => tab.href === location.pathname.split('/')[locationLength],
    );
    if (found) {
      setSelectedTab({ href: found.href, name: found.name });
    }
  }, []);

  useEffect(() => {
    const found: IPageTab | undefined = ORGANIZATION_TABS.find(
      (tab) => tab.href === location.pathname.split('/')[locationLength],
    );
    if (found) {
      setSelectedTab({ href: found.href, name: found.name });
    }
  }, [location]);

  useEffect(() => {
    if (error) useErrorToast(t('error'));

    if (restrictOrganizationRequestMutation.error) useErrorToast(t('restrict.request_error'));
  }, [error, restrictOrganizationRequestMutation.error]);

  const onTabClick = (tab: IPageTab) => {
    setSelectedTab({ href: tab.href, name: tab.name });
    navigate(tab.href);
  };

  const onDelete = () => {
    if (organization)
      restrictOrganizationRequestMutation.mutate(undefined, {
        onSuccess: () => {
          useSuccessToast(t('restrict.request_success'));
        },
      });
    setOrganizationDeleteModal(false);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mt-1">
        <span className="text-gray-800 font-titilliumBold sm:text-2xl lg:text-3xl text-lg">
          {t('my_organization')}
        </span>
        {role !== UserRole.EMPLOYEE && (
          <button
            aria-label={t('restrict.confirm')}
            type="button"
            className="delete-button mr-1 max-h-10 sm:max-w-auto max-w-fit items-center"
            onClick={() => setOrganizationDeleteModal(true)}
          >
            {t('restrict.confirm')}
          </button>
        )}
      </div>
      <p className="text-gray-400 sm:pb-6 sm:pt-2 pt-2 pb-3 sm:text-sm lg:text-base text-xs">
        {t('description')}
      </p>
      <div className="pb-6 flex">
        <nav
          className="2xl:flex hidden xs:pt-6 pt-0 flex-col space-y-4 sm:space-y-0 sm:gap-x-4 sm:gap-y-4 flex-wrap lg:flex-row cursor-pointer select-none"
          aria-label="Tabs"
        >
          {ORGANIZATION_TABS.map((tab) => (
            <a
              aria-label={tab.name}
              key={tab.name}
              onClick={() => onTabClick(tab)}
              className={classNames(
                selectedTab?.href === tab.href
                  ? 'bg-green-tab text-gray-800 font-titilliumBold'
                  : 'font-titilliumSemiBold',
                'text-gray-700 rounded-md sm:text-lg lg:text-lg text-md px-8 py-2 hover:bg-green-tab lg:whitespace-nowrap',
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
              collection: ORGANIZATION_TABS,
              displayedAttribute: 'name',
            }}
            selected={selectedTab}
            onChange={onTabClick}
          />
        </span>
      </div>
      <Outlet context={{ disabled: true, isLoading, updateOrganization }} />
      {isOrganizationDeleteModalOpen && (
        <ConfirmationModal
          title={t('restrict.title')}
          description={t('restrict.description')}
          closeBtnLabel={t('back', { ns: 'common' })}
          confirmBtnLabel={t('restrict.confirm')}
          onClose={() => {
            setOrganizationDeleteModal(false);
          }}
          onConfirm={onDelete}
        />
      )}
    </div>
  );
};

export default OrganizationProfile;
