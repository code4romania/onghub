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
        steps: application.steps.map((step) => ({ item: step })),
      });
      setLogo(application.logo);
    }
  }, [application]);

  useEffect(() => {
    if (updateApplicationError) {
      useErrorToast('Eroare la editarea aplicatiei');
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
          useSuccessToast('Aplicatie modificata cu succes!');
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
      title="Editeaza aplicatie"
      subtitle="Lorem ipsum. Administrează de aici profilul tău de organizație pentru a putea accesa aplicațiile disponibile."
      backButton={{ btnLabel: 'Inapoi', onBtnClick: () => navigate(`/application/${id}/details`) }}
    >
      <div className="w-full bg-white shadow rounded-lg mt-4">
        <div className="py-5 lg:px-10 px-5 flex justify-between">
          <span className="font-titilliumBold sm:text-lg lg:text-xl text-md text-gray-800">
            {'Editare pagina aplicatie'}
          </span>

          <button
            type="button"
            className="save-button sm:text-sm lg:text-base text-xs"
            onClick={handleSubmit(onSubmit)}
          >
            <PencilIcon className="-ml-1 mr-2 sm:h-5 sm:w-5 h-4 w-4" aria-hidden="true" />
            Salveaza modificari
          </button>
        </div>

        <div className="w-full border-t border-gray-300" />
        <ApplicationForm
          isEditApplication
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
