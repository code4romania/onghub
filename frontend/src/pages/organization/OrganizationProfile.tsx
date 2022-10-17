/* eslint-disable no-constant-condition */
import React, { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { classNames } from '../../common/helpers/tailwind.helper';
import { useErrorToast, useSuccessToast } from '../../common/hooks/useToast';
import { useCountiesQuery } from '../../services/nomenclature/Nomenclature.queries';
import { useOrganizationByProfileQuery } from '../../services/organization/Organization.queries';
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
  const [selectedTab, setSelectedTab] = useState<{ id: number; name: string } | null>({
    id: 0,
    name: ORGANIZATION_TABS.find((item) => item.id === 0)?.name || '',
  });
  const { t } = useTranslation('organization');
  const { role } = useAuthContext();
  const [isOrganizationDeleteModalOpen, setOrganizationDeleteModal] = useState(false);

  // TODO: Load nomenclature data on app init
  useCountiesQuery();

  // load organization data
  const { error } = useOrganizationByProfileQuery();

  const restrictOrganizationRequestMutation = useRestrictOrganizationRequestMutation();

  const { organization } = useSelectedOrganization();

  useEffect(() => {
    const found: IPageTab | undefined = ORGANIZATION_TABS.find(
      (tab) => tab.href === location.pathname.split('/')[2],
    );
    if (found) {
      setSelectedTab({ id: found.id, name: found.name });
    }
  }, []);

  useEffect(() => {
    if (error) useErrorToast(t('error'));

    if (restrictOrganizationRequestMutation.error) useErrorToast(t('restrict.request_error'));
  }, [error, restrictOrganizationRequestMutation.error]);

  const onTabClick = (tab: IPageTab) => {
    setSelectedTab({ id: tab.id, name: tab.name });
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
    <div>
      <div className="flex justify-between mt-1">
        <span className="text-gray-800 font-titilliumBold sm:text-2xl lg:text-3xl text-lg">
          {t('my_organization')}
        </span>
        {role !== UserRole.EMPLOYEE && (
          <button
            type="button"
            className="delete-button mr-1"
            onClick={() => setOrganizationDeleteModal(true)}
          >
            {t('restrict.confirm')}
          </button>
        )}
      </div>
      <p className="text-gray-400 sm:pt-6 pt-3 sm:text-sm lg:text-base text-xs">
        {t('description')}
      </p>
      <div className="pb-6 flex">
        <nav
          className="lg:flex hidden xs:pt-6 pt-0 flex-col space-y-4 sm:space-y-0 sm:gap-x-4 sm:gap-y-4 flex-wrap lg:flex-row cursor-pointer select-none"
          aria-label="Tabs"
        >
          {ORGANIZATION_TABS.map((tab) => (
            <a
              key={tab.name}
              onClick={() => onTabClick(tab)}
              className={classNames(
                tab.href === location.pathname.split('/')[2]
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
              collection: ORGANIZATION_TABS,
              displayedAttribute: 'name',
            }}
            selected={selectedTab}
            onChange={onTabClick}
          />
        </span>
      </div>
      <Outlet />
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
