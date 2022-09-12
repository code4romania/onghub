import { PencilIcon } from '@heroicons/react/outline';
import { PlusIcon, XIcon } from '@heroicons/react/solid';
import React, { useEffect, useState } from 'react';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { fileToURL } from '../../../common/helpers/format.helper';
import { classNames } from '../../../common/helpers/tailwind.helper';
import { useErrorToast, useSuccessToast } from '../../../common/hooks/useToast';
import ContentWrapper from '../../../components/content-wrapper/ContentWrapper';
import InputField from '../../../components/InputField/InputField';
import { Loading } from '../../../components/loading/Loading';
import RadioGroup from '../../../components/RadioGroup/RadioGroup';
import SectionHeader from '../../../components/section-header/SectionHeader';
import Textarea from '../../../components/Textarea/Textarea';
import {
  useCreateApplicationMutation,
  useUpdateApplicationMutation,
} from '../../../services/application/Application.queries';
import { useSelectedApplication } from '../../../store/selectors';
import { ApplicationTypeEnum } from '../constants/ApplicationType.enum';
import { AddAppConfig } from './AddApplicationConfig';

const AddApplication = ({ edit }: { edit?: boolean }) => {
  const navigate = useNavigate();
  const [readonly, setReadonly] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [logo, setLogo] = useState<string | null>(null);

  const { selectedApplication: application } = useSelectedApplication();

  // Create Mutation
  const {
    mutateAsync: mutateApplication,
    error: createApplicationError,
    isLoading: createApplicationLoading,
  } = useCreateApplicationMutation();

  // Edit Mutation
  const {
    mutateAsync: updateApplication,
    error: updateApplicationError,
    isLoading: updateApplicationLoading,
  } = useUpdateApplicationMutation();

  // React Hook Form
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'steps',
  });

  // watchers
  const type = watch('type');

  useEffect(() => {
    if (application) {
      reset({
        ...application,
        steps: application.steps.map((step) => ({ step })),
      });
    }
  }, [application]);

  const handleSave = async (data: any) => {
    const dto = { ...data, steps: data.steps.map((step: any) => step.step) };
    await mutateApplication(dto);
    useSuccessToast('Aplicatie modificata cu succes!');
    navigate('/store');
  };

  const handleEdit = async (data: any) => {
    if (application) {
      const dto = { ...data, steps: data.steps.map((step: any) => step.step) };
      await updateApplication({
        applicationId: application?.id?.toString(),
        applicationUpdatePayload: dto,
      });
      useSuccessToast('Aplicatie modificata cu succes!');
      navigate(-1);
    }
  };

  const startEdit = () => {
    setReadonly(false);
  };

  useEffect(() => {
    if (!edit) {
      reset({
        steps: [{ step: '' }],
      });
    }
  }, []);

  useEffect(() => {
    if (createApplicationError) {
      useErrorToast((createApplicationError as any)?.response?.data.message);
    }

    if (updateApplicationError) {
      useErrorToast((createApplicationError as any)?.response?.data.message);
    }
  }, [createApplicationError, updateApplicationError]);

  const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      event.target.value = '';
    } else {
      event.target.value = '';
    }
  };

  if (createApplicationLoading || updateApplicationLoading) {
    return <Loading />;
  }

  return (
    <ContentWrapper
      title={'Adauga aplicatie'}
      subtitle="Lorem ipsum. Administrează de aici profilul tău de organizație pentru a putea accesa aplicațiile disponibile."
      backButton={{ btnLabel: 'Inapoi', onBtnClick: () => navigate(-1) }}
    >
      <div className="w-full bg-white shadow rounded-lg mt-4">
        <div className="py-5 px-10 flex justify-between">
          <span className="font-titilliumBold text-xl text-gray-800">
            {edit ? 'Editare pagina aplicatie' : 'Generare pagina aplicatie'}
          </span>

          <button
            type="button"
            className={classNames(readonly ? 'edit-button' : 'save-button')}
            onClick={readonly ? startEdit : handleSubmit(edit ? handleEdit : handleSave)}
          >
            <PencilIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {readonly ? 'Editeaza' : 'Salveaza modificari'}
          </button>
        </div>

        <div className="w-full border-t border-gray-300" />
        <div className="p-5 sm:p-10 flex">
          <div className="flex flex-col gap-4 w-full">
            <SectionHeader
              title="Date generale"
              subTitle="This information will be displayed publicly so be careful what you share"
            />
            <form className="space-y-8 xxl:w-1/3 xl:w-1/2 divide-y divide-gray-200 divide-">
              <div className="flex flex-col gap-4">
                <Controller
                  key={AddAppConfig.name.key}
                  name={AddAppConfig.name.key}
                  rules={AddAppConfig.name.rules}
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <InputField
                        config={{
                          ...AddAppConfig.name.config,
                          name: AddAppConfig.name.key,
                          error: errors[AddAppConfig.name.key]?.message,
                          defaultValue: value,
                          onChange: onChange,
                        }}
                        readonly={readonly}
                      />
                    );
                  }}
                />
                {!edit && (
                  <RadioGroup
                    control={control}
                    readonly={readonly}
                    errors={errors[AddAppConfig.type.key]}
                    config={AddAppConfig.type}
                  />
                )}
                <Controller
                  key={AddAppConfig.shortDescription.key}
                  name={AddAppConfig.shortDescription.key}
                  rules={AddAppConfig.shortDescription.rules}
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <InputField
                        config={{
                          ...AddAppConfig.shortDescription.config,
                          name: AddAppConfig.shortDescription.key,
                          error: errors[AddAppConfig.shortDescription.key]?.message,
                          defaultValue: value,
                          onChange: onChange,
                        }}
                        readonly={readonly}
                      />
                    );
                  }}
                />
                <Controller
                  key={AddAppConfig.description.key}
                  name={AddAppConfig.description.key}
                  rules={AddAppConfig.description.rules}
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <Textarea
                        config={{
                          ...AddAppConfig.description.config,
                          name: AddAppConfig.description.key,
                          error: errors[AddAppConfig.description.key]?.message,
                          defaultValue: value,
                          onChange: onChange,
                        }}
                        readonly={readonly}
                      />
                    );
                  }}
                />
                <Controller
                  key={AddAppConfig.website.key}
                  name={AddAppConfig.website.key}
                  rules={AddAppConfig.website.rules}
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <InputField
                        config={{
                          ...AddAppConfig.website.config,
                          name: AddAppConfig.website.key,
                          error: errors[AddAppConfig.website.key]?.message,
                          defaultValue: value,
                          onChange: onChange,
                        }}
                        readonly={readonly}
                      />
                    );
                  }}
                />
                {/* Website-urile independente nu au LINK de login. */}
                {type !== ApplicationTypeEnum.INDEPENDENT && (
                  <Controller
                    key={AddAppConfig.loginLink.key}
                    name={AddAppConfig.loginLink.key}
                    rules={AddAppConfig.loginLink.rules}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <InputField
                          config={{
                            ...AddAppConfig.loginLink.config,
                            name: AddAppConfig.loginLink.key,
                            error: errors[AddAppConfig.loginLink.key]?.message,
                            defaultValue: value,
                            onChange: onChange,
                          }}
                          readonly={readonly}
                        />
                      );
                    }}
                  />
                )}
                <Controller
                  key={AddAppConfig.videoLink.key}
                  name={AddAppConfig.videoLink.key}
                  rules={AddAppConfig.videoLink.rules}
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <InputField
                        config={{
                          ...AddAppConfig.videoLink.config,
                          name: AddAppConfig.videoLink.key,
                          error: errors[AddAppConfig.videoLink.key]?.message,
                          defaultValue: value,
                          onChange: onChange,
                        }}
                        readonly={readonly}
                      />
                    );
                  }}
                />
              </div>
              {/*  Logo */}
              <div className="sm:col-span-6 gap-4 flex flex-col">
                <label htmlFor="photo" className="block text-normal font-normal text-gray-700">
                  Logo organizatie
                </label>

                <div className="mt-1 flex items-center">
                  <span className="h-20 w-20 rounded-full overflow-hidden bg-gray-100">
                    {!file && !logo ? (
                      <svg
                        className="h-full w-full text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ) : (
                      <img src={fileToURL(file) || (logo as string)} className="h-20 w-80" />
                    )}
                  </span>
                  {!readonly && (
                    <>
                      <label
                        htmlFor="uploadPhoto"
                        className="cursor-pointer ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Incarca logo
                      </label>
                      <input
                        className="h-0 w-0"
                        name="uploadPhoto"
                        id="uploadPhoto"
                        type="file"
                        accept="image/png, image/jpeg, image/svg"
                        onChange={onChangeFile}
                      />
                    </>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-500 font-normal" id="email-description">
                  Lorem ipsum. Încarcă logo-ul organizației tale, la o calitate cât mai bună.
                </p>
              </div>
              {/* End Logo */}
              <div className="flex flex-col gap-4 pt-4">
                <SectionHeader
                  title="Pasi pentru adaugarea aplicatiei"
                  subTitle="This information will be displayed publicly so be careful what you share"
                />
                {fields.map((item, index) => {
                  return (
                    <div className="flex gap-4 items-start" key={index}>
                      <Controller
                        name={`steps.${index}.step`}
                        control={control}
                        rules={AddAppConfig.step.rules}
                        render={({ field: { onChange, value } }) => {
                          return (
                            <InputField
                              config={{
                                ...AddAppConfig.step.config,
                                name: AddAppConfig.step.key,
                                error:
                                  errors.steps &&
                                  ((
                                    errors as {
                                      [x: string]: any | any[];
                                    }
                                  )?.steps[index]?.step?.message as any),
                                defaultValue: value,
                                onChange: onChange,
                              }}
                              readonly={readonly}
                            />
                          );
                        }}
                      />
                    </div>
                  );
                })}
                {!readonly && (
                  <div className="flex gap-4">
                    <button
                      className="save-button"
                      onClick={(e: any) => {
                        e.preventDefault();
                        append({ step: '' });
                      }}
                    >
                      <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                      Adauga mai multi pasi
                    </button>
                    <button
                      className="add-button"
                      onClick={(e: any) => {
                        e.preventDefault();
                        remove(fields.length - 1);
                      }}
                    >
                      <XIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                      Sterge pas
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default AddApplication;
