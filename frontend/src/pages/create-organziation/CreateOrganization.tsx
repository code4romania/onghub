/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { InternalErrors } from '../../common/errors/internal-errors';
import { mapSelectToValue } from '../../common/helpers/format.helper';
import Header from '../../components/Header/Header';
import { Loading } from '../../components/loading/Loading';
import { useCountiesQuery } from '../../services/nomenclature/Nomenclature.queries';
import { useCreateOrganizationRequestMutation } from '../../services/request/Request.queries';
import ProgressSteps from './components/ProgressSteps';
import {
  CREATE_FLOW_URL,
  CREATE_LOCAL_STORAGE_ACTIVE_STEP_KEY,
  CREATE_LOCAL_STORAGE_KEY,
  ORGANIZATION_AGREEMENT_KEY,
} from './constants/CreateOrganization.constant';
import { ICreateOrganizationPayload } from './interfaces/CreateOrganization.interface';
import { IOrganization } from '../organization/interfaces/Organization.interface';
import { CREATE_ORGANIZARION_ERRORS } from '../../common/errors/entities/create-organization-errors.class';
import { updateActiveStepIndexInLocalStorage } from '../../common/helpers/utils.helper';

const STEPS = ['agreement', 'account', 'general', 'activity', 'legal'];

const CreateOrganization = () => {
  const [success, setSuccess] = useState(false);
  const [errorCode, setErrorCode] = useState<CREATE_ORGANIZARION_ERRORS | null>();
  const [organization, setOrganization] = useState<ICreateOrganizationPayload | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [organizationStatute, setOrganizationStatute] = useState<File | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const navigate = useNavigate();

  const error = useMemo(() => errorCode ? InternalErrors.createOrganizationErrors.getError(errorCode) : null, [errorCode]);

  const {
    mutate: mutateRequest,
    isLoading: requestLoading,
  } = useCreateOrganizationRequestMutation();

  const { t } = useTranslation(['organization', 'common']);

  useCountiesQuery();

  useEffect(() => {
    const { activeStepIndex } = JSON.parse(
      localStorage.getItem(CREATE_LOCAL_STORAGE_ACTIVE_STEP_KEY) || '{"activeStepIndex": 0}',
    );

    const agreement = localStorage.getItem(ORGANIZATION_AGREEMENT_KEY);

    if (agreement === 'false') {
      setActiveStepIndex(0);

      navigate(`/${CREATE_FLOW_URL.BASE}/${STEPS[0]}`);
    } else {
      setActiveStepIndex(activeStepIndex);

      navigate(`/${CREATE_FLOW_URL.BASE}/${STEPS[activeStepIndex]}`);
    }
  }, []);

  useEffect(() => {
    if (activeStepIndex) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeStepIndex])


  const onComplete = (updatedOrganization: any, step?: number) => {
    setOrganization(updatedOrganization);

    if (updatedOrganization &&
      updatedOrganization.admin &&
      updatedOrganization.general &&
      updatedOrganization.activity &&
      updatedOrganization.legal &&
      step === 4) {
      submit(updatedOrganization);
    }
  }

  const submit = async (organization: ICreateOrganizationPayload) => {
    // parse and map activity id's correctly
    let { activity } = organization;

    // map existing coalitions
    const coalitions = activity.coalitions
      ? [...activity.coalitions.filter((val: any) => !val.isNew).map(mapSelectToValue)]
      : [];
    const federations = activity.federations
      ? [...activity.federations.filter((val: any) => !val.isNew).map(mapSelectToValue)]
      : [];

    // map new federations and coalitions
    const newFederations = activity.federations
      ? [...activity.federations.filter((val: any) => val.isNew).map((val: any) => val.value)]
      : [];

    const newCoalitions = activity.coalitions
      ? [...activity.coalitions.filter((val: any) => val.isNew).map((val: any) => val.value)]
      : [];

    activity = {
      ...activity,
      branches: activity.branches ? [...activity.branches.map(mapSelectToValue)] : [],
      cities: activity.cities ? [...activity.cities.map(mapSelectToValue)] : [],
      regions: activity.regions ? [...activity.regions.map(mapSelectToValue)] : [],
      coalitions,
      federations,
      newFederations,
      newCoalitions,
    };

    mutateRequest(
      { organization: { ...organization, activity }, logo, organizationStatute },
      {
        onSuccess: () => {
          localStorage.removeItem(CREATE_LOCAL_STORAGE_KEY);
          localStorage.removeItem(CREATE_LOCAL_STORAGE_ACTIVE_STEP_KEY);
          localStorage.removeItem(ORGANIZATION_AGREEMENT_KEY);
          setSuccess(true);
        },
        onError: (requestError: any) => {
          setErrorCode(
            (requestError as any)?.response?.data?.code,
          );
        }
      },
    );
  };

  const reset = () => {
    switch (errorCode) {
      case CREATE_ORGANIZARION_ERRORS.FILE_002:
      case CREATE_ORGANIZARION_ERRORS.FILE_004: {
        navigate(`/${CREATE_FLOW_URL.BASE}/${CREATE_FLOW_URL.GENERAL}`);
        updateActiveStepIndexInLocalStorage(activeStepIndex, 2, setActiveStepIndex);
        break;
      }
      case CREATE_ORGANIZARION_ERRORS.FILE_003:
      case CREATE_ORGANIZARION_ERRORS.FILE_005: {
        navigate(`/${CREATE_FLOW_URL.BASE}/${CREATE_FLOW_URL.LEGAL}`);
        updateActiveStepIndexInLocalStorage(activeStepIndex, 4, setActiveStepIndex);
        break;
      }
      default: {
        // DO NOTHING.
      }
    }

    setSuccess(false);
    setErrorCode(null);
  };

  if (requestLoading) {
    return <Loading />;
  }

  return (
    <div className="w-screen h-screen max-w-full ">
      <Header hideLogInButton />
      <div className="flex p-6">
        <div className="content w-full flex flex-col gap-4" >
          <ProgressSteps activeStepIndex={activeStepIndex} setActiveStepIndex={setActiveStepIndex} disabled={error !== null || success} />
          {!success && !error && (
            <Outlet
              context={[
                organization,
                onComplete,
                logo,
                setLogo,
                organizationStatute,
                setOrganizationStatute,
                activeStepIndex,
                setActiveStepIndex,
              ]}
            />
          )}
          {success && (
            <div className="bg-white rounded-lg shadow p-5 sm:p-10 m-1">
              <div className="flex items-center justify-start pb-6 gap-4">
                <CheckCircleIcon className="fill-green w-8 h-8" />
                <span className="font-titilliumBold sm:text-2xl lg:text-3xl text-lg">
                  {t('create.congratulations')}
                </span>
              </div>
              <p className="leading-6">{t('create.success')}</p>
            </div>
          )}
          {error && (
            <div className="bg-white rounded-lg shadow p-5 sm:p-10 m-1 flex flex-col gap-4">
              <div className="flex items-center justify-start pb-6 gap-4">
                <ExclamationCircleIcon className="fill-red-600 w-8 h-8" />
                <span className="font-titilliumBold sm:text-2xl lg:text-3xl text-lg">
                  {t('error', { ns: 'common' })}
                </span>
              </div>
              <p className="leading-6">{error || t('wrong', { ns: 'common' })}</p>
              <button
                aria-label={t('create.again')}
                id="create-organization__button-reset"
                type="button"
                className="mt-4 w-48 flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white sm:text-sm lg:text-base text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0"
                onClick={reset}
              >
                {t('create.again')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateOrganization;
