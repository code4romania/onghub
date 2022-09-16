import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import ProgressSteps from './components/ProgressSteps';
import { ICreateOrganizationPayload } from './interfaces/CreateOrganization.interface';
import { useCountiesQuery } from '../../services/nomenclature/Nomenclature.queries';
import { useUploadOrganizationFilesMutation } from '../../services/organization/Organization.queries';
import { Loading } from '../../components/loading/Loading';
import { CREATE_LOCAL_STORAGE_KEY } from './constants/CreateOrganization.constant';
import { useCreateOrganizationRequestMutation } from '../../services/request/Request.queries';
import { CreateOrganizationRequestDTO } from '../../services/request/interfaces/Request.dto';
import { createRequestDTOMapper } from './helper/CreateOrganization.helper';
import { useTranslation } from 'react-i18next';

const CreateOrganization = () => {
  const [organization, setOrganization] = useState<ICreateOrganizationPayload>({
    admin: null,
    general: null,
    activity: null,
    legal: null,
  });

  const {
    mutateAsync: mutateRequest,
    error: requestError,
    isLoading: requestLoading,
  } = useCreateOrganizationRequestMutation();
  const {
    mutate: filesMutation, // To be used for file uploading.
    error: filesError,
    isLoading: filesLoading,
  } = useUploadOrganizationFilesMutation();

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    if (organization.legal) {
      sendOrganization();
    }
  }, [organization.legal]);

  useEffect(() => {
    if (requestError) {
      setError(`${(requestError as any)?.response?.data?.message}`);
    }

    if (filesError) {
      setError(t('logo.load', { ns: 'common' }));
    }
  }, [requestError, filesError]);

  useEffect(() => {
    if (requestLoading || filesLoading) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [requestLoading, filesLoading]);

  const sendOrganization = async () => {
    if (
      organization &&
      organization.admin &&
      organization.general &&
      organization.activity &&
      organization.legal
    ) {
      const dto: CreateOrganizationRequestDTO = createRequestDTOMapper(organization);

      const saved = await mutateRequest({
        ...dto,
      });

      // PENDING DECISION - PUBLIC ENDPOINT NEEDED
      // Data uploading
      // const data = new FormData();

      // if (organization.legal.organizationStatute) {
      //   data.append(CREATE_FILE_STATUTE, organization.legal.organizationStatute);
      // }

      // if (organization.general.logo) {
      //   data.append(CREATE_FILE_LOGO, organization.general.logo);
      // }

      // await filesMutation.mutateAsync({ id: 13 as number, data });
      // End Data uploading

      localStorage.removeItem(CREATE_LOCAL_STORAGE_KEY);
      setSuccess(true);
    }
  };

  const reset = () => {
    setSuccess(false);
    setError('');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-screen h-screen max-w-full ">
      <Header />
      <div className="flex p-6">
        <div className="content overflow-scroll w-full pl-6 flex flex-col gap-4">
          <ProgressSteps disabled={success} />
          {!success && !error && <Outlet context={[organization, setOrganization]} />}
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
                type="button"
                className="mt-4 w-48 flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0  sm:text-sm"
                onClick={reset}
              >
                {t('again')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateOrganization;
