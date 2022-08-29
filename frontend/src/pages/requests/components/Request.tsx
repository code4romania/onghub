/* eslint-disable no-constant-condition */
import { ExclamationIcon, XIcon, CheckIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { classNames } from '../../../common/helpers/tailwind.helper';
import { useErrorToast, useSuccessToast } from '../../../common/hooks/useToast';
import { IPageTab } from '../../../common/interfaces/tabs.interface';
import ConfirmRemovalModal, {
  ConfirmRemovalModalProps,
} from '../../../components/confim-removal-modal/ConfirmRemovalModal';
import ContentWrapper from '../../../components/content-wrapper/ContentWrapper';
import { Loading } from '../../../components/loading/Loading';
import { useCountiesQuery } from '../../../services/nomenclature/Nomenclature.queries';
import {
  useApproveRequestMutation,
  useRejectRequestMutation,
  useRequest,
} from '../../../services/request/Request.queries';
import { ORGANIZATION_TABS } from '../../organization/constants/Tabs.constants';
import { APPROVE_MODAL, REJECT_MODAL } from '../constants/Request.modals';
import { RequestStatus } from '../enum/RequestStatus.enum';

const Request = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  // const [modalConfig, setModalConfig] = useState({} as Partial<ConfirmRemovalModalProps>);
  // const [isModalOpen, setModalOpen] = useState(false);

  // TODO: Load nomenclature data on app init
  useCountiesQuery();

  // load organization data
  const { data: request, error, refetch } = useRequest(params.id ? params?.id : '');

  // apporve & reject
  const {
    mutateAsync: approveMutate,
    error: approveError,
    isLoading: approveLoading,
  } = useApproveRequestMutation();
  const {
    mutateAsync: rejectMutate,
    error: rejectError,
    isLoading: rejectLoading,
  } = useRejectRequestMutation();

  useEffect(() => {
    const found: IPageTab | undefined = ORGANIZATION_TABS.find(
      (tab) => tab.href === location.pathname.split('/')[2],
    );
    if (found) {
      setSelectedTab(found.id);
    }
  }, []);

  useEffect(() => {
    if (error) {
      useErrorToast('Could not load Organization');
    } else if (approveError || rejectError) {
      useErrorToast('Error while changing the status');
    }
  }, [error, approveError, rejectError]);

  const onTabClick = (tab: IPageTab) => {
    setSelectedTab(tab.id);
    navigate(tab.href);
  };

  const onApprove = async () => {
    await approveMutate(id as string, {
      onSuccess: () => {
        useSuccessToast('Status actualizat.');
        refetch();
      },
    });
  };

  const onReject = async () => {
    await rejectMutate(id as string, {
      onSuccess: () => {
        useSuccessToast('Status actualizat.');
        refetch();
      },
    });
  };

  if (approveLoading || rejectLoading) {
    return <Loading />;
  }

  return (
    <div>
      <ContentWrapper
        title={request?.organization.organizationGeneral.name || ''}
        subtitle=" Administrează de aici profilul tău de organizație pentru a putea accesa aplicațiile
    disponibile."
        backButton={{ btnLabel: 'Inapoi', onBtnClick: () => navigate('requests') }}
      >
        <div>
          {request?.status === RequestStatus.PENDING && (
            <div className="w-full bg-white shadow rounded-lg py-5 px-10 flex justify-between items-center flex-col sm:flex-row mt-4">
              <div className="flex gap-4">
                <ExclamationIcon className="text-orange h-7 w-7" />
                <p className="text-gray-800 font-titilliumBold rounded-md  text-xl hover:bg-green-tab lg:whitespace-nowrap">
                  Datele de mai jos corespund unei solicitari in curs de aprobare.
                </p>
              </div>
              <div className="flex gap-4">
                <button type="button" className="red-button gap-2" onClick={onReject}>
                  <XIcon className="w-5 h-5" /> Respinge
                </button>
                <button type="button" className="save-button gap-2" onClick={onApprove}>
                  <CheckIcon className="w-5 h-5" /> Aproba
                </button>
              </div>
            </div>
          )}
          <div className="pb-6 flex">
            <nav
              className="flex  pt-6 flex-col space-y-4 sm:space-y-0 sm:gap-x-4 sm:gap-y-4 flex-wrap lg:flex-row cursor-pointer select-none"
              aria-label="Tabs"
            >
              {ORGANIZATION_TABS.map((tab) => (
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
        </div>
      </ContentWrapper>
      {/* {isModalOpen && <ConfirmRemovalModal {...modalConfig} onClose={() => setModalOpen(false)} onConfirm={} />} */}
    </div>
  );
};

export default Request;
