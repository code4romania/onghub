import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { Loading } from '../../components/loading/Loading';
import { useCountiesQuery } from '../../services/nomenclature/Nomenclature.queries';
import { useCreateOrganizationRequestMutation } from '../../services/request/Request.queries';
import ProgressSteps from './components/ProgressSteps';
import { CREATE_LOCAL_STORAGE_KEY } from './constants/CreateOrganization.constant';
import { ICreateOrganizationPayload } from './interfaces/CreateOrganization.interface';

const CreateOrganization = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [organization, setOrganization] = useState<ICreateOrganizationPayload | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [organizationStatute, setOrganizationStatute] = useState<File | null>(null);

  const {
    mutateAsync: mutateRequest,
    isLoading: requestLoading,
    error: requestError,
  } = useCreateOrganizationRequestMutation();

  const { t } = useTranslation(['organization', 'common']);

  useCountiesQuery();

  useEffect(() => {
    const localStorageData = JSON.parse(localStorage.getItem(CREATE_LOCAL_STORAGE_KEY) || '{}');
    if (localStorageData) {
      setOrganization(localStorageData);
    }
  }, []);

  useEffect(() => {
    if (organization) {
      localStorage.setItem(CREATE_LOCAL_STORAGE_KEY, JSON.stringify(organization));
    }
  }, [organization]);

  useEffect(() => {
    if (organization?.legal) {
      submit();
    }
  }, [organization]);

  useEffect(() => {
    if (requestError) {
      setError(`${(requestError as any)?.response?.data?.message}`);
    }
  }, [requestError]);

  const submit = async () => {
    if (
      organization &&
      organization.admin &&
      organization.general &&
      organization.activity &&
      organization.legal
    )
      await mutateRequest(
        { organization, logo, organizationStatute },
        {
          onSuccess: () => {
            localStorage.removeItem(CREATE_LOCAL_STORAGE_KEY);
            setSuccess(true);
          },
        },
      );
  };

  const reset = () => {
    setSuccess(false);
    setError('');
  };

  if (requestLoading) {
    return <Loading />;
  }

  return (
    <div className="w-screen h-screen max-w-full ">
      <Header />
      <div className="flex p-6">
        <div className="content w-full pl-6 flex flex-col gap-4">
          <ProgressSteps disabled={success} />
          {!success && !error && (
            <Outlet
              context={[
                organization,
                setOrganization,
                logo,
                setLogo,
                organizationStatute,
                setOrganizationStatute,
              ]}
            />
          )}
          {success && (
            <div className="bg-white rounded-lg shadow p-5 sm:p-10 m-1">
              <div className="flex items-center justify-start pb-6 gap-4">
                <CheckCircleIcon className="fill-green w-8 h-8" />
                <span className="font-titilliumBold text-3xl">{t('create.congratulations')}</span>
              </div>
              <p className="leading-6">{t('create.success')}</p>
            </div>
          )}
          {error && (
            <div className="bg-white rounded-lg shadow p-5 sm:p-10 m-1 flex flex-col gap-4">
              <div className="flex items-center justify-start pb-6 gap-4">
                <ExclamationCircleIcon className="fill-red-600 w-8 h-8" />
                <span className="font-titilliumBold text-3xl">{t('error', { ns: 'common' })}</span>
              </div>
              <p className="leading-6">{error || t('wrong', { ns: 'common' })}</p>
              <button
                id="create-organization__button-reset"
                type="button"
                className="mt-4 w-48 flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0  sm:text-sm"
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
