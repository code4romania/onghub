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
import { useNavigate, useOutletContext } from 'react-router-dom';
import { openInNewTab } from '../../../common/helpers/format.helper';
import { useTranslation } from 'react-i18next';
import { useRemovOngApplicationRequest } from '../../../services/application/Application.queries';
import { ApplicationPullingType } from '../../apps-store/enums/application-pulling-type.enum';
import ApplicationFeedbackCard from './ApplicationFeedbackCard';

const ApplicationDetails = () => {
  const navigate = useNavigate();
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

  const onRedirectToPracticePrograms = () => {
    navigate('/practice-program');
  };

  const onRedirectToServices = () => {
    navigate('/service');
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
    <div className="flex gap-4 mr-1 mb-1 relative sm:flex-row flex-col">
      <div className="flex flex-col rounded-lg bg-white shadow md:w-96 lg:p-8 p-5 divide-y divide-gray-200 h-full">
        <div className="flex flex-col gap-4 min-h-full">
          <img
            src={application?.logo || logo}
            className="sm:h-full h-32 w-full sm:py-10 py-5 object-contain"
          />
          <p className="font-titilliumBold text-black sm:text-lg lg:text-xl text-md tracking-wide">
            {application?.name}
          </p>
          <div className="flex gap-2 pb-2 items-center">
            <GlobeAltIcon className="h-4 w-4" />
            <p
              className="hover:text-blue-800 hover:cursor-pointer sm:text-sm lg:text-base text-xs"
              onClick={() => {
                openInNewTab(application.website);
              }}
            >
              {t('details.website')}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:gap-4 gap-2 pt-4 pb-4">
          <p className="sm:text-sm lg:text-base text-xs">{t('details.how_to')}</p>
          {application?.steps.map((step: any, index: number) => (
            <div
              className="flex sm:gap-4 gap-2 items-center sm:text-sm lg:text-base text-xs"
              key={index}
            >
              <div className="rounded-full border-2 m-0 p-4 flex justify-center items-center w-4 h-4 sm:text-sm lg:text-base text-xs">
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
                <button
                  className="save-button px-8 flex gap-4 sm:text-sm lg:text-base text-xs"
                  onClick={requestApplication}
                >
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
                <p className="text-gray-700 font-titilliumBold sm:text-sm lg:text-base text-xs">
                  {t('details.auto')}
                </p>
              </div>
            )}
            {/* The application is independent and active */}
            {application?.status === OngApplicationStatus.PENDING_REMOVAL && (
              <div className="flex pt-4 gap-4 items-center justify-center">
                <p className="text-gray-700 font-titilliumBold sm:text-sm lg:text-base text-xs">
                  {t('details.pending_removal')}
                </p>
              </div>
            )}
            {/* The application is not independent and active */}
            {application?.type !== ApplicationTypeEnum.INDEPENDENT &&
              application?.status === OngApplicationStatus.ACTIVE &&
              role !== UserRole.EMPLOYEE && (
                <div className="flex pt-4 gap-4 items-center justify-center">
                  <button
                    className="edit-button px-8 flex gap-4"
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
                  <button
                    className="save-button px-8 flex gap-4 sm:text-sm lg:text-base text-xs"
                    disabled
                  >
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
              application.status !== OngApplicationStatus.DISABLED) && (
              <ApplicationFeedbackCard
                icon={<CheckCircleIcon className="text-green w-6" />}
                title={t('details.active')}
                description={t('details.define_active')}
                actions={
                  <>
                    {!application?.pullingType && (
                      <button
                        className="save-button px-8 flex gap-4 sm:text-sm lg:text-base text-xs"
                        onClick={onOpen}
                      >
                        {t('details.open')}
                      </button>
                    )}
                    {application?.pullingType === ApplicationPullingType.PRACTICE_PROGRAM && (
                      <div className="w-full flex flex-col lg:flex-row">
                        <button
                          className="edit-button px-8 flex gap-4 sm:text-sm lg:text-base text-xs"
                          onClick={onOpen}
                        >
                          {t('details.practice_program.redirect_to_site')}
                        </button>
                        <button
                          className="save-button px-8 mt-2 lg:mt-0 lg:ml-4 flex gap-4 sm:text-sm lg:text-base text-xs"
                          onClick={onRedirectToPracticePrograms}
                        >
                          {t('details.practice_program.redirect_to_practice_programs')}
                        </button>
                      </div>
                    )}
                    {application?.pullingType === ApplicationPullingType.CIVIC_SERVICE && (
                      <div className="w-full flex flex-col lg:flex-row">
                        <button
                          className="edit-button px-8 flex gap-4 sm:text-sm lg:text-base text-xs"
                          onClick={onOpen}
                        >
                          {t('details.services.redirect_to_site')}
                        </button>
                        <button
                          className="save-button px-8 mt-2 lg:mt-0 lg:ml-4 flex gap-4 sm:text-sm lg:text-base text-xs"
                          onClick={onRedirectToServices}
                        >
                          {t('details.services.redirect_to_services')}
                        </button>
                      </div>
                    )}
                  </>
                }
              />
            )}
            {application?.status === OngApplicationStatus.PENDING && (
              <ApplicationFeedbackCard
                icon={<ClockIcon className="w-6 h-6  text-yellow-600" />}
                title={t('details.pending')}
                description={t('details.configure')}
                actions={
                  <button className="edit-button px-8 flex gap-4" onClick={abandonRequest}>
                    <XIcon className="h-5 w-5" />
                    {t('details.cancel')}
                  </button>
                }
              />
            )}
            {application?.status === OngApplicationStatus.RESTRICTED && (
              <ApplicationFeedbackCard
                icon={<ExclamationCircleIcon className="w-6 h-6  text-red-500" />}
                title={t('details.restricted')}
                description={t('details.restore')}
              />
            )}
            {application?.status === OngApplicationStatus.DISABLED && (
              <ApplicationFeedbackCard
                icon={<ExclamationCircleIcon className="w-6 h-6  text-red-500" />}
                title={t('details.disabled.title')}
                description={t('details.disabled.description')}
              />
            )}
          </React.Fragment>
        )}
        <ApplicationFeedbackCard
          title={t('details.description')}
          description={application?.description}
        />
        <div className="w-full h-full bg-white shadow rounded-lg">
          <div className="py-5 lg:px-10 px-5 flex justify-between">
            <span className="font-titilliumBold sm:text-lg lg:text-xl text-md text-gray-800">
              {t('details.video')}
            </span>
          </div>
          <div className="w-full border-t border-gray-300" />
          <div className="lg:p-8 p-5">
            <iframe
              className="sm:h-96 h-48 w-full"
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
