/* eslint-disable no-constant-condition */
import { ExclamationIcon, XIcon, CheckIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { classNames } from '../../../common/helpers/tailwind.helper';
import { useErrorToast, useSuccessToast } from '../../../common/hooks/useToast';
import { IPageTab } from '../../../common/interfaces/tabs.interface';
import ConfirmationModal from '../../../components/confim-removal-modal/ConfirmationModal';
import ContentWrapper from '../../../components/content-wrapper/ContentWrapper';
import { Loading } from '../../../components/loading/Loading';
import { useCountiesQuery } from '../../../services/nomenclature/Nomenclature.queries';
import {
  useApproveOrganizationRequestMutation,
  useRejectOrganizationRequestMutation,
  useOrganizationRequest,
} from '../../../services/request/Request.queries';
import { APPROVE_MODAL_CONFIG, REJECT_MODAL_CONFIG } from '../constants/Request.modals';
import { RequestStatus } from '../enum/RequestStatus.enum';
import { ORGANIZATION_TABS } from '../../organization/constants/Tabs.constants';
import Select from '../../../components/Select/Select';
import { useOrganizationMutation } from '../../../services/organization/Organization.queries';

const Request = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState<{ href: string; name: string } | null>({
    href: ORGANIZATION_TABS.find((item) => item.id === 0)?.href || '',
    name: ORGANIZATION_TABS.find((item) => item.id === 0)?.name || '',
  });
  const [isApproveModalOpen, setApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);

  const { t } = useTranslation(['requests', 'organization', 'common']);

  const locationLength = location.pathname.split('/').length - 1;

  // TODO: Load nomenclature data on app init
  useCountiesQuery();

  // load organization data
  const { data: request, error, isLoading: dataLoading } = useOrganizationRequest(id || '');

  const { mutate: updateOrganization, isLoading } = useOrganizationMutation();

  // apporve & reject
  const {
    mutateAsync: approveMutate,
    error: approveError,
    isLoading: approveLoading,
  } = useApproveOrganizationRequestMutation();

  const {
    mutateAsync: rejectMutate,
    error: rejectError,
    isLoading: rejectLoading,
  } = useRejectOrganizationRequestMutation();

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
    if (error) {
      useErrorToast(t('error', { ns: 'organization' }));
    } else if (approveError || rejectError) {
      useErrorToast(t('status_error'));
    }
  }, [error, approveError, rejectError]);

  const onTabClick = (tab: IPageTab) => {
    setSelectedTab({ href: tab.href, name: tab.name });
    navigate(tab.href);
  };

  const onApprove = async () => {
    await approveMutate(id as string, {
      onSuccess: () => {
        useSuccessToast(t('status_update'));
        navigate('/requests', { replace: true });
      },
      onSettled: () => {
        setApproveModalOpen(false);
      },
    });
  };

  const onReject = async () => {
    await rejectMutate(id as string, {
      onSuccess: () => {
        useSuccessToast(t('status_update'));
        navigate('/requests', { replace: true });
      },
      onSettled: () => {
        setApproveModalOpen(false);
      },
    });
  };

  if (dataLoading || approveLoading || rejectLoading) {
    return <Loading />;
  }

  return (
    <div>
      <ContentWrapper
        title={request?.organization.organizationGeneral.name || ''}
        subtitle={t('description')}
        backButton={{
          btnLabel: t('back', { ns: 'common' }),
          onBtnClick: () => navigate('/requests'),
        }}
      >
        <div>
          {request?.status === RequestStatus.PENDING && (
            <div className="w-full mb-6 bg-white shadow rounded-lg py-5 lg:px-10 px-5 flex justify-between items-center flex-col sm:flex-row gap-3">
              <div className="flex gap-4">
                <ExclamationIcon className="text-orange h-7 w-7" />
                <p className="text-gray-800 font-titilliumBold rounded-md sm:text-lg lg:text-xl text-md hover:bg-green-tab lg:whitespace-nowrap">
                  {t('data_pending')}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  className="red-button gap-2 sm:text-sm lg:text-base text-xs items-center"
                  onClick={() => setRejectModalOpen(true)}
                >
                  <XIcon className="w-5 h-5" /> {t('reject')}
                </button>
                <button
                  type="button"
                  className="save-button gap-2 sm:text-sm lg:text-base text-xs items-center"
                  onClick={() => setApproveModalOpen(true)}
                >
                  <CheckIcon className="w-5 h-5" /> {t('approve')}
                </button>
              </div>
            </div>
          )}
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
                  collection: ORGANIZATION_TABS,
                  displayedAttribute: 'name',
                }}
                selected={selectedTab}
                onChange={onTabClick}
              />
            </span>
          </div>
          <Outlet context={[false, isLoading, updateOrganization]} />
        </div>
      </ContentWrapper>
      {isApproveModalOpen && (
        <ConfirmationModal
          {...APPROVE_MODAL_CONFIG}
          onClose={() => setApproveModalOpen(false)}
          onConfirm={onApprove}
        />
      )}
      {isRejectModalOpen && (
        <ConfirmationModal
          {...REJECT_MODAL_CONFIG}
          onClose={() => setRejectModalOpen(false)}
          onConfirm={onReject}
        />
      )}
    </div>
  );
};

export default Request;
