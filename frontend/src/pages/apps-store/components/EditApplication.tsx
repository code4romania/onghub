import React, { useEffect, useState } from 'react';
import { PencilIcon } from '@heroicons/react/outline';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useErrorToast, useSuccessToast } from '../../../common/hooks/useToast';
import ContentWrapper from '../../../components/content-wrapper/ContentWrapper';
import { Loading } from '../../../components/loading/Loading';
import {
  useApplicationQuery,
  useUpdateApplicationMutation,
} from '../../../services/application/Application.queries';
import { CreateApplicationDto } from '../../../services/application/interfaces/Application.dto';
import ApplicationForm from './ApplicationForm';
import { useTranslation } from 'react-i18next';
import { PullingTypeOptions } from './AddApplicationConfig';

const EditApplication = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [file, setFile] = useState<File | null>(null);
  const [logo, setLogo] = useState<string | null>(null);

  // React Hook Form
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateApplicationDto>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  // Fetch application
  const { data: application, isLoading: isApplicationLoading } = useApplicationQuery(id as string);
  const { t } = useTranslation();

  // Edit Mutation
  const {
    mutateAsync: updateApplication,
    error: updateApplicationError,
    isLoading: updateApplicationLoading,
  } = useUpdateApplicationMutation();

  useEffect(() => {
    if (application) {
      reset({
        ...application,
        steps: application.steps?.map((step) => ({ item: step })),
        pullingType: application.pullingType
          ? (PullingTypeOptions.find((item) => item.value === application.pullingType) as any)
          : undefined,
      });
      setLogo(application.logo);
    }
  }, [application]);

  useEffect(() => {
    if (updateApplicationError) {
      useErrorToast(t('app:edit.error'));
    }
  }, [updateApplicationError]);

  const onSubmit = async (data: Partial<CreateApplicationDto>) => {
    // don't set the logo path
    const { logo, ...payload } = data;
    await updateApplication(
      {
        applicationId: id as string,
        applicationUpdatePayload: payload,
        logo: file as File,
      },
      {
        onSuccess: () => {
          useSuccessToast(t('app:edit.success'));
          navigate(-1);
        },
      },
    );
  };

  if (updateApplicationLoading || isApplicationLoading) {
    return <Loading />;
  }

  return (
    <ContentWrapper
      title={t('app:edit.title')}
      subtitle={t('app:edit.subtitle')}
      backButton={{ btnLabel: 'Inapoi', onBtnClick: () => navigate(`/application/${id}/details`) }}
    >
      <div className="w-full bg-white shadow rounded-lg mt-4">
        <div className="py-5 lg:px-10 px-5 flex justify-between">
          <span className="font-titilliumBold sm:text-lg lg:text-xl text-md text-gray-800">
            {t('app:edit:page_title')}
          </span>

          <button
            aria-label={t('common:save')}
            type="button"
            className="save-button sm:text-sm lg:text-base text-xs"
            onClick={handleSubmit(onSubmit)}
          >
            <PencilIcon className="-ml-1 mr-2 sm:h-5 sm:w-5 h-4 w-4" aria-hidden="true" />
            {t('common:save')}
          </button>
        </div>

        <div className="w-full border-t border-gray-300" />
        <ApplicationForm
          readonly
          control={control}
          errors={errors}
          watch={watch}
          logo={logo}
          file={file}
          setFile={setFile}
        />
      </div>
    </ContentWrapper>
  );
};

export default EditApplication;
