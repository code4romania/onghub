import { PencilIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useErrorToast, useSuccessToast } from '../../../common/hooks/useToast';
import ContentWrapper from '../../../components/content-wrapper/ContentWrapper';
import { Loading } from '../../../components/loading/Loading';
import { useCreateApplicationMutation } from '../../../services/application/Application.queries';
import { CreateApplicationDto } from '../../../services/application/interfaces/Application.dto';
import ApplicationForm from './ApplicationForm';

const AddApplication = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const { t } = useTranslation(['appstore', 'common']);
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
  // Create Mutation
  const {
    mutateAsync: mutateApplication,
    error: createApplicationError,
    isLoading: createApplicationLoading,
  } = useCreateApplicationMutation();

  useEffect(() => {
    reset({
      steps: [{ item: '' }],
    });
  }, []);

  useEffect(() => {
    if (createApplicationError) {
      useErrorToast(t('create.error'));
    }
  }, [createApplicationError]);

  const onSubmit = async (data: CreateApplicationDto) => {
    await mutateApplication(
      { application: data, logo: file as File },
      {
        onSuccess: () => {
          useSuccessToast(t('create.success'));
          navigate('/all-apps');
        },
      },
    );
  };

  if (createApplicationLoading) {
    return <Loading />;
  }

  return (
    <ContentWrapper
      title={t('add')}
      subtitle={t('create.description')}
      backButton={{
        btnLabel: t('back', { ns: 'common' }),
        onBtnClick: () => navigate('/all-apps'),
      }}
    >
      <div className="w-full bg-white shadow rounded-lg mt-4">
        <div className="py-5 sm:px-10 px-5 flex justify-between">
          <span className="font-titilliumBold sm:text-lg lg:text-xl text-md text-gray-800 self-center">
            {t('create.generate')}
          </span>

          <button
            type="button"
            className="save-button sm:text-sm lg:text-base text-xs"
            onClick={handleSubmit(onSubmit)}
          >
            <PencilIcon className="-ml-1 mr-2 sm:h-5 sm:w-5 h-4 w-4" aria-hidden="true" />
            {t('save', { ns: 'common' })}
          </button>
        </div>

        <div className="w-full border-t border-gray-300" />
        <ApplicationForm
          control={control}
          errors={errors}
          watch={watch}
          file={file}
          setFile={setFile}
        />
      </div>
    </ContentWrapper>
  );
};

export default AddApplication;
