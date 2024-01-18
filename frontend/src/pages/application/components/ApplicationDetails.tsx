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
import { ApplicationStatus } from '../../../services/application/interfaces/Application.interface';
import ApplicationStatusFeedback from './ApplicationStatusFeedback';

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
    openInNewTab(application.loginLink);
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
          useSuccessToast(t('details.remove_success'));
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
            alt="Application logo"
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
        {application?.steps && (
          <div className="flex flex-col sm:gap-4 gap-2 pt-4 pb-4">
            <p className="sm:text-sm lg:text-base text-xs">{t('details.how_to')}</p>
            {application.steps.map((step: any, index: number) => (
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
        )}

        {role !== UserRole.SUPER_ADMIN && (
          <div>
            {/* Application active */}
            {application?.status === ApplicationStatus.ACTIVE && (
              <>
                {/* Handle simple login and standalone application */}
                {application?.type !== ApplicationTypeEnum.INDEPENDENT && (
                  <>
                    {/* The application is not added */}
                    {application?.ongStatus === null && role === UserRole.ADMIN && (
                      <div className="flex pt-4 gap-4 items-center justify-center">
                        <button
                          aria-label={
                            application.type === ApplicationTypeEnum.SIMPLE
                              ? t('details.add')
                              : t('details.request')
                          }
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
                    {/* The application is not independent and active */}
                    {application?.ongStatus === OngApplicationStatus.ACTIVE &&
                      role === UserRole.ADMIN && (
                        <div className="flex pt-4 gap-4 items-center justify-center">
                          <button
                            aria-label={t('details.delete')}
                            className="edit-button px-8 flex gap-4"
                            onClick={() => setConfirmationModalOpen(true)}
                          >
                            <XIcon className="h-5 w-5" />
                            {t('details.delete')}
                          </button>
                        </div>
                      )}
                    {/* The application is not independent and pending */}
                    {application?.ongStatus === OngApplicationStatus.PENDING && (
                      <div className="flex flex-col pt-4 gap-4 items-center justify-center">
                        <button
                          aria-label={t('details.request')}
                          className="save-button px-8 flex gap-4 sm:text-sm lg:text-base text-xs"
                          disabled
                        >
                          <PlusIcon className="h-5 w-5" />
                          {t('details.request')}
                        </button>
                        <p>{t('details.contact')}</p>
                      </div>
                    )}
                  </>
                )}
                {/* The application was restricted */}
                {application?.ongStatus === OngApplicationStatus.RESTRICTED && (
                  <ApplicationStatusFeedback>{t('details.restricted')}</ApplicationStatusFeedback>
                )}
                {/* The application is independent and active */}
                {application?.type === ApplicationTypeEnum.INDEPENDENT && (
                  <ApplicationStatusFeedback>{t('details.auto')}</ApplicationStatusFeedback>
                )}
                {/* The application is standalone and pending removal */}
                {application?.ongStatus === OngApplicationStatus.PENDING_REMOVAL && (
                  <ApplicationStatusFeedback>
                    {t('details.pending_removal')}
                  </ApplicationStatusFeedback>
                )}
              </>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 w-full h-full">
        {role !== UserRole.SUPER_ADMIN && (
          <React.Fragment>
            {application?.status !== ApplicationStatus.DISABLED && (
              <>
                {application?.ongStatus === OngApplicationStatus.ACTIVE && (
                  <ApplicationFeedbackCard
                    icon={<CheckCircleIcon className="text-green w-6" />}
                    title={t('details.active')}
                    description={t('details.define_active')}
                    actions={
                      <>
                        {!application?.pullingType && (
                          <button
                            aria-label={t('details.open')}
                            className="save-button px-8 flex gap-4 sm:text-sm lg:text-base text-xs"
                            onClick={onOpen}
                          >
                            {t('details.open')}
                          </button>
                        )}
                        {application?.pullingType === ApplicationPullingType.PRACTICE_PROGRAM && (
                          <div className="w-full flex flex-col lg:flex-row">
                            <button
                              aria-label={t('details.practice_program.redirect_to_site')}
                              className="edit-button px-8 flex gap-4 sm:text-sm lg:text-base text-xs"
                              onClick={onOpen}
                            >
                              {t('details.practice_program.redirect_to_site')}
                            </button>
                            <button
                              aria-label={t(
                                'details.practice_program.redirect_to_practice_programs',
                              )}
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
                              aria-label={t('details.services.redirect_to_site')}
                              className="edit-button px-8 flex gap-4 sm:text-sm lg:text-base text-xs"
                              onClick={onOpen}
                            >
                              {t('details.services.redirect_to_site')}
                            </button>
                            <button
                              aria-label={t('details.services.redirect_to_services')}
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
                {application?.ongStatus === OngApplicationStatus.PENDING && (
                  <ApplicationFeedbackCard
                    icon={<ClockIcon className="w-6 h-6  text-yellow-600" />}
                    title={t('details.pending')}
                    description={t('details.configure')}
                    actions={
                      <button
                        aria-label={t('details.cancel')}
                        className="edit-button px-8 flex gap-4"
                        onClick={abandonRequest}
                      >
                        <XIcon className="h-5 w-5" />
                        {t('details.cancel')}
                      </button>
                    }
                  />
                )}
                {application?.ongStatus === OngApplicationStatus.RESTRICTED && (
                  <ApplicationFeedbackCard
                    icon={<ExclamationCircleIcon className="w-6 h-6  text-red-500" />}
                    title={t('details.restricted')}
                    description={t('details.restore')}
                  />
                )}
              </>
            )}
            {application?.status === ApplicationStatus.DISABLED && (
              <ApplicationFeedbackCard
                icon={<ExclamationCircleIcon className="w-6 h-6  text-red-500" />}
                title={t('details.disabled.title')}
                description={t('details.disabled.description')}
              />
            )}
            {application?.type === ApplicationTypeEnum.INDEPENDENT && (
              <ApplicationFeedbackCard
                icon={<CheckCircleIcon className="text-green w-6" />}
                title={t('details.active')}
                description={t('details.define_active')}
                actions={
                  <div className="w-full flex flex-col lg:flex-row">
                    <button
                      aria-label={t('details.open')}
                      className="save-button px-8 flex gap-4 sm:text-sm lg:text-base text-xs"
                      onClick={onOpen}
                    >
                      {t('details.open')}
                    </button>
                  </div>
                }
              />
            )}
          </React.Fragment>
        )}

        <ApplicationFeedbackCard
          title={t('details.description')}
          description={application?.description}
        />

        {application?.videoLink && (
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
                srcDoc={`<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=${
                  application?.videoLink
                }><img src=https://img.youtube.com/vi/${
                  application?.videoLink?.split('/')[application?.videoLink?.split('/').length - 1]
                }/hqdefault.jpg alt='${t(
                  'details.another_description',
                )}'><span style="display: flex; flex-direction:column; align-items:center"><button style="background:transparent; border:none; width: 70px; cursor: pointer" class="ytp-large-play-button ytp-button ytp-large-play-button-red-bg" aria-label="Redă"><svg version="1.1" viewBox="0 0 68 48"><path class="ytp-large-play-button-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path><path d="M 45,24 27,14 27,34" fill="#fff"></path></svg></button></span></a>`}
              />
            </div>
          </div>
        )}
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
