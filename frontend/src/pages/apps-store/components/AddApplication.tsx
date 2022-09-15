import { PencilIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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
      useErrorToast('Eroare la crearea aplicatiei');
    }
  }, [createApplicationError]);

  const onSubmit = async (data: CreateApplicationDto) => {
    await mutateApplication(
      { application: data, logo: file as File },
      {
        onSuccess: () => {
          useSuccessToast('Aplicatie adaugata cu succes!');
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
      title="Adauga aplicatie"
      subtitle="Lorem ipsum. Administrează de aici profilul tău de organizație pentru a putea accesa aplicațiile disponibile."
      backButton={{ btnLabel: 'Inapoi', onBtnClick: () => navigate('/store') }}
    >
      <div className="w-full bg-white shadow rounded-lg mt-4">
        <div className="py-5 px-10 flex justify-between">
          <span className="font-titilliumBold text-xl text-gray-800">
            Generare pagina aplicatie
          </span>

          <button type="button" className="save-button" onClick={handleSubmit(onSubmit)}>
            <PencilIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Salveaza modificari
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
