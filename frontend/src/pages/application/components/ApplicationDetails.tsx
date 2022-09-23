import React, { useState } from 'react';
import { GlobeAltIcon, PlusIcon, XIcon } from '@heroicons/react/outline';
import logo from '../../../assets/images/logo.svg';
import { useAuthContext } from '../../../contexts/AuthContext';
import { UserRole } from '../../users/enums/UserRole.enum';
import { ApplicationTypeEnum } from '../../apps-store/constants/ApplicationType.enum';
import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
import ConfirmationModal from '../../../components/confim-removal-modal/ConfirmationModal';
import {
  useAbandonApplicationRequestMutation,
  useCreateApplicationRequestMutation,
} from '../../../services/request/Request.queries';
import { useErrorToast, useSuccessToast } from '../../../common/hooks/useToast';
import { OngApplicationStatus } from '../../requests/interfaces/OngApplication.interface';
import { useOutletContext } from 'react-router-dom';
import { openInNewTab } from '../../../common/helpers/format.helper';
import { useTranslation } from 'react-i18next';
import { useRemovOngApplicationRequest } from '../../../services/application/Application.queries';

const ApplicationDetails = () => {
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [application, refecthApplication] = useOutletContext<any>();
  const { role } = useAuthContext();

  const { t } = useTranslation(['app', 'common']);

  // Mutation
  const { mutateAsync: mutateCreateApplicationRequest } = useCreateApplicationRequestMutation();

  const { mutateAsync: mutateAbandonApplicationRequest } = useAbandonApplicationRequestMutation();

  const { mutateAsync: removeOngApplication } = useRemovOngApplicationRequest();

  // Actions
  const requestApplication = async () => {
    if (application) {
      await mutateCreateApplicationRequest(application?.id, {
        onSuccess: () => {
          useSuccessToast(t('details.request_successful'));
          refecthApplication();
        },
        onError: () => {
          useErrorToast(t('details.request_error'));
        },
      });
    }
  };

  const abandonRequest = async () => {
    if (application) {
      await mutateAbandonApplicationRequest(application?.id, {
        onSuccess: () => {
          useSuccessToast(t('details.request_successful'));
          refecthApplication();
        },
        onError: () => {
          useErrorToast(t('details.request_error'));
        },
      });
    }
  };

  const onOpen = (e: any) => {
    e.preventDefault();
    if (application.type === ApplicationTypeEnum.INDEPENDENT && application.website) {
      openInNewTab(application.website);
    } else if (application.loginLink) {
      openInNewTab(application.loginLink);
    }
  };

  const removeApplication = () => {
    removeOngApplication(
      { applicationId: application?.id },
      {
        onSuccess: () => {
          refecthApplication();
        },
        onError: () => {
          useErrorToast(t('details.request_error'));
        },
        onSettled: () => {
          setConfirmationModalOpen(false);
        },
      },
    );
  };

  return (
    <div className="flex gap-4 mr-1 mb-1 relative">
      <div className="flex flex-col rounded-lg bg-white shadow w-96 p-8 divide-y divide-gray-200 h-full">
        <div className="flex flex-col gap-4 min-h-full">
          <img src={application?.logo || logo} className="h-full w-full pt-10 pb-10" />
          <p className="font-titilliumBold text-black text-xl tracking-wide">{application?.name}</p>
          <div className="flex gap-2 pb-2 items-center">
            <GlobeAltIcon className="h-4 w-4" />
            <p
              className="hover:text-blue-800 hover:cursor-pointer"
              onClick={() => {
                openInNewTab(application.website);
              }}
            >
              {t('details.website')}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-4 pb-4">
          <p>{t('details.how_to')}</p>
          {application?.steps.map((step: any, index: number) => (
            <div className="flex gap-4 items-center" key={index}>
              <div className="rounded-full border-2 m-0 p-4 flex justify-center items-center w-4 h-4">
                {index + 1}
              </div>
              {step}
            </div>
          ))}
        </div>

        {role !== UserRole.SUPER_ADMIN && (
          <div>
            {/* The application is not added */}
            {!application?.status && application?.type !== ApplicationTypeEnum.INDEPENDENT && (
              <div className="flex pt-4 gap-4 items-center justify-center">
                <button className="save-button pl-8 pr-8 flex gap-4" onClick={requestApplication}>
                  <PlusIcon className="h-5 w-5" />
                  {application.type === ApplicationTypeEnum.SIMPLE
                    ? t('details.add')
                    : t('details.request')}
                </button>
              </div>
            )}
            {/* The application was restricted */}
            {application?.status === OngApplicationStatus.RESTRICTED && (
              <div className="flex pt-4 gap-4 items-center justify-center">
                <p className="">{t('details.restricted')}</p>
              </div>
            )}
            {/* The application is independent and active */}
            {application?.type === ApplicationTypeEnum.INDEPENDENT && (
              <div className="flex pt-4 gap-4 items-center justify-center">
                <p className="text-gray-700 font-titilliumBold">{t('details.auto')}</p>
              </div>
            )}
            {/* The application is independent and active */}
            {application?.status === OngApplicationStatus.PENDING_REMOVAL && (
              <div className="flex pt-4 gap-4 items-center justify-center">
                <p className="text-gray-700 font-titilliumBold">{t('details.pending_removal')}</p>
              </div>
            )}
            {/* The application is not independent and active */}
            {application?.type !== ApplicationTypeEnum.INDEPENDENT &&
              application?.status === OngApplicationStatus.ACTIVE &&
              role !== UserRole.EMPLOYEE && (
                <div className="flex pt-4 gap-4 items-center justify-center">
                  <button
                    className="edit-button pl-8 pr-8 flex gap-4"
                    onClick={() => setConfirmationModalOpen(true)}
                  >
                    <XIcon className="h-5 w-5" />
                    {t('details.delete')}
                  </button>
                </div>
              )}
            {/* The application is not independent and pending */}
            {application?.type !== ApplicationTypeEnum.INDEPENDENT &&
              application?.status === OngApplicationStatus.PENDING && (
                <div className="flex flex-col pt-4 gap-4 items-center justify-center">
                  <button className="save-button pl-8 pr-8 flex gap-4" disabled>
                    <PlusIcon className="h-5 w-5" />
                    {t('details.request')}
                  </button>
                  <p>{t('details.contact')}</p>
                </div>
              )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 w-full h-full">
        {role !== UserRole.SUPER_ADMIN && (
          <React.Fragment>
            {(application?.status === OngApplicationStatus.ACTIVE ||
              (application?.type === ApplicationTypeEnum.INDEPENDENT &&
                application.status !== OngApplicationStatus.DISABLED)) && (
              <div className="w-full h-full bg-white shadow rounded-lg">
                <div className="py-5 px-10 flex gap-2 items-center">
                  <CheckCircleIcon className="text-green w-6" />
                  <span className="font-titilliumBold text-xl text-gray-800">
                    {t('details.active')}
                  </span>
                </div>
                <div className="w-full border-t border-gray-300" />
                <div className="p-8 flex flex-col gap-4">
                  <p className="break-all">{t('details.define_active')}</p>
                  <div>
                    <button className="save-button pl-8 pr-8 flex gap-4" onClick={onOpen}>
                      {t('details.open')}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {application?.status === OngApplicationStatus.PENDING && (
              <div className="w-full h-full bg-white shadow rounded-lg">
                <div className="py-5 px-10 flex gap-2 items-center">
                  <ClockIcon className="w-6 h-6  text-yellow-600" />
                  <span className="font-titilliumBold text-xl text-gray-800 ">
                    {t('details.pending')}
                  </span>
                </div>
                <div className="w-full border-t border-gray-300" />
                <div className="p-8 flex flex-col gap-4">
                  <p className="break-all">{t('details.configure')}</p>
                  <div>
                    <button className="edit-button pl-8 pr-8 flex gap-4" onClick={abandonRequest}>
                      <XIcon className="h-5 w-5" />
                      {t('details.cancel')}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {application?.status === OngApplicationStatus.RESTRICTED && (
              <div className="w-full h-full bg-white shadow rounded-lg">
                <div className="py-5 px-10 flex gap-2 items-center">
                  <ExclamationCircleIcon className="w-6 h-6  text-red-500" />
                  <span className="font-titilliumBold text-xl text-gray-800 ">
                    {t('details.restricted')}
                  </span>
                </div>
                <div className="w-full border-t border-gray-300" />
                <div className="p-8 flex flex-col gap-4">
                  <p className="break-all">{t('details.restore')}</p>
                </div>
              </div>
            )}
            {application?.status === OngApplicationStatus.DISABLED && (
              <div className="w-full h-full bg-white shadow rounded-lg">
                <div className="py-5 px-10 flex gap-2 items-center">
                  <ExclamationCircleIcon className="w-6 h-6  text-red-500" />
                  <span className="font-titilliumBold text-xl text-gray-800 ">
                    Accesul la aplicatie este indisponibil momentan
                  </span>
                </div>
                <div className="w-full border-t border-gray-300" />
                <div className="p-8 flex flex-col gap-4">
                  <p className="break-all">Vom reveni cu noutati in curand.</p>
                </div>
              </div>
            )}
          </React.Fragment>
        )}
        <div className="w-full h-full bg-white shadow rounded-lg">
          <div className="py-5 px-10 flex justify-between">
            <span className="font-titilliumBold text-xl text-gray-800">
              {t('details.description')}
            </span>
          </div>
          <div className="w-full border-t border-gray-300" />
          <div className=" p-8 ">
            <p className="break-all">{application?.description}</p>
          </div>
        </div>
        <div className="w-full h-full bg-white shadow rounded-lg">
          <div className="py-5 px-10 flex justify-between">
            <span className="font-titilliumBold text-xl text-gray-800">{t('details.video')}</span>
          </div>
          <div className="w-full border-t border-gray-300" />
          <div className="p-8">
            <iframe
              className="h-96 w-full"
              src={application?.videoLink}
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={t('details.another_description')}
            />
          </div>
        </div>
      </div>
      {isConfirmationModalOpen && (
        <ConfirmationModal
          title={t('details.close_title')}
          description={t('details.close_description')}
          closeBtnLabel={t('back', { ns: 'common' })}
          confirmBtnLabel={t('details.close_button')}
          onClose={() => {
            setConfirmationModalOpen(false);
          }}
          onConfirm={removeApplication}
        />
      )}
    </div>
  );
};

export default ApplicationDetails;
