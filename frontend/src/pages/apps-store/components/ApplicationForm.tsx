import { PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import React from 'react';
import {
  Controller,
  useFieldArray,
  Control,
  FieldErrorsImpl,
  DeepRequired,
  UseFormWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FILE_TYPES_ACCEPT } from '../../../common/constants/file.constants';
import { fileToURL } from '../../../common/helpers/format.helper';
import InputField from '../../../components/InputField/InputField';
import RadioGroup from '../../../components/RadioGroup/RadioGroup';
import SectionHeader from '../../../components/section-header/SectionHeader';
import Select from '../../../components/Select/Select';
import Textarea from '../../../components/Textarea/Textarea';
import { CreateApplicationDto } from '../../../services/application/interfaces/Application.dto';
import { ApplicationTypeEnum } from '../constants/ApplicationType.enum';
import { AddAppConfig } from './AddApplicationConfig';

interface ApplicationFormProps {
  control: Control<CreateApplicationDto, object>;
  errors: FieldErrorsImpl<DeepRequired<CreateApplicationDto>>;
  watch: UseFormWatch<CreateApplicationDto>;
  file: File | null;
  setFile: (file: File) => void;
  logo?: string | null;
  readonly?: boolean;
}

const ApplicationForm = ({
  readonly,
  control,
  errors,
  watch,
  logo,
  file,
  setFile,
}: ApplicationFormProps) => {
  const { fields, append, remove } = useFieldArray<CreateApplicationDto>({
    control,
    name: 'steps',
  });

  const { t } = useTranslation('appstore');

  // watchers
  const type = watch('type');

  const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      event.target.value = '';
    } else {
      event.target.value = '';
    }
  };

  return (
    <div className="p-5 sm:p-10 flex">
      <div className="flex flex-col gap-4 w-full">
        <SectionHeader title={t('form.title')} subTitle={t('form.subtitle')} />
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
                      error: errors.name?.message,
                      defaultValue: value,
                      onChange: onChange,
                      id: 'application-form__name',
                    }}
                  />
                );
              }}
            />
            {!readonly && (
              <RadioGroup control={control} errors={errors.type} config={AddAppConfig.type} />
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
                      error: errors.shortDescription?.message,
                      defaultValue: value,
                      onChange: onChange,
                      id: 'application-form__short-description',
                    }}
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
                      error: errors.description?.message,
                      defaultValue: value,
                      onChange: onChange,
                      id: 'application-form__description',
                    }}
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
                      error: errors.website?.message,
                      defaultValue: value,
                      onChange: onChange,
                      id: 'application-form__website',
                    }}
                  />
                );
              }}
            />
            <Controller
              key={AddAppConfig.loginLink.key}
              name={AddAppConfig.loginLink.key}
              rules={
                type !== ApplicationTypeEnum.INDEPENDENT
                  ? AddAppConfig.loginLink.rules
                  : AddAppConfig.openLink.rules
              }
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <InputField
                    config={{
                      ...(type === ApplicationTypeEnum.INDEPENDENT
                        ? { ...AddAppConfig.openLink.config }
                        : { ...AddAppConfig.loginLink.config }),
                      name: AddAppConfig.loginLink.key,
                      error: errors.loginLink?.message,
                      defaultValue: value,
                      onChange: onChange,
                      id: 'application-form__login-link',
                    }}
                  />
                );
              }}
            />
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
                      error: errors.videoLink?.message,
                      defaultValue: value,
                      onChange: onChange,
                      onBlur: onChange,
                      id: 'application-form__video-link',
                    }}
                  />
                );
              }}
            />
            <Controller
              key={AddAppConfig.pullingType.key}
              name={AddAppConfig.pullingType.key}
              rules={AddAppConfig.pullingType.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <Select
                    config={{
                      id: 'application-form__pulling-type',
                      ...AddAppConfig.pullingType.config,
                    }}
                    selected={value}
                    onChange={onChange}
                  />
                );
              }}
            />
          </div>
          {/*  Logo */}
          <div className="sm:col-span-6 gap-4 flex flex-col">
            <label
              htmlFor="photo"
              className="block sm:text-sm lg:text-base text-xs font-normal text-gray-700"
            >
              {t('form.logo')}
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
                  <img
                    alt="Logo"
                    src={fileToURL(file) || (logo as string)}
                    className="h-20 w-80 object-cover"
                  />
                )}
              </span>
              <>
                <label
                  htmlFor="uploadPhoto"
                  className="cursor-pointer ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {t('form.upload_logo')}
                </label>
                <input
                  className="h-0 w-0"
                  name="uploadPhoto"
                  id="uploadPhoto"
                  type="file"
                  accept={FILE_TYPES_ACCEPT.LOGO}
                  onChange={onChangeFile.bind(this)}
                />
              </>
            </div>
            {!readonly && (
              <p className="mt-1 text-sm text-gray-500 font-normal" id="email-description">
                {t('form.upload_description')}
              </p>
            )}
          </div>
          {/* End Logo */}
          <div className="flex flex-col gap-4 pt-4">
            <SectionHeader title={t('form.steps_title')} subTitle={t('form.steps_subtitle')} />
            {fields.map((item, index) => {
              return (
                <div className="flex gap-4 items-start" key={index}>
                  <Controller
                    name={`steps.${index}.item`}
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
                              )?.steps[index]?.item?.message as any),
                            defaultValue: value,
                            onChange: onChange,
                            id: 'application-form__step',
                          }}
                        />
                      );
                    }}
                  />
                </div>
              );
            })}
            <div className="flex gap-4 sm:flex-row flex-col">
              <button
                className="save-button sm:text-sm lg:text-base text-xs"
                onClick={(e: any) => {
                  e.preventDefault();
                  append({ item: '' });
                }}
              >
                <PlusIcon className="-ml-1 mr-2 sm:h-5 sm:w-5 h-4 w-4" aria-hidden="true" />
                {t('form.add_step')}
              </button>
              {fields.length > 0 && (
                <button
                  aria-label={t('form.delete_step')}
                  className="add-button sm:text-sm lg:text-base text-xs"
                  onClick={(e: any) => {
                    e.preventDefault();
                    remove(fields.length - 1);
                  }}
                >
                  <XMarkIcon className="-ml-1 mr-2 sm:h-5 sm:w-5 h-4 w-4" aria-hidden="true" />
                  {t('form.delete_step')}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
