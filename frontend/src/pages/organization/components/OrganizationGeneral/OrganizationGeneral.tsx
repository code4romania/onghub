import React, { useState } from 'react';
import { PencilIcon } from '@heroicons/react/solid';
import { classNames } from '../../../../common/helpers/tailwind.helper';
import { Controller, useForm } from 'react-hook-form';
import { OrganizationGeneralConfig } from './OrganizationGeneralConfig';
import InputField from '../../../../components/InputField/InputField';
import RadioGroup from '../../../../components/RadioGroup/RadioGroup';
import Select from '../../../../components/Select/Select';
import ContactForm from '../../../../components/Contact/Contact';
import { read } from 'fs';
import Textarea from '../../../../components/Textarea/Textarea';

const OrganizationGeneral = () => {
  const [readonly, setReadonly] = useState(true);

  // React Hook Form
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({ mode: 'onChange', reValidateMode: 'onChange' });

  const handleSave = (data: any) => {
    // console.log(data);
    setReadonly((mode) => !mode);
  };

  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="p-5 sm:p-10 flex justify-between">
        <span className="font-titilliumBold text-xl text-gray-800">Date generale</span>

        <button
          type="button"
          className={classNames(readonly ? 'edit-button' : 'save-button')}
          onClick={handleSave}
        >
          <PencilIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          {readonly ? 'Editeaza' : 'Salveaza modificari'}
        </button>
      </div>

      <div className="w-full border-t border-gray-300" />
      <div className="p-5 sm:p-10 flex">
        <div className="flex flex-col gap-y-4 w-full">
          <span className="font-bold text-default-gray-800">General</span>
          <Controller
            key={OrganizationGeneralConfig.name.key}
            name={OrganizationGeneralConfig.name.key}
            rules={OrganizationGeneralConfig.name.rules}
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <InputField
                  config={{
                    ...OrganizationGeneralConfig.name.config,
                    error: errors[OrganizationGeneralConfig.name.key]?.message,
                    defaultValue: value,
                    onChange: onChange,
                  }}
                  readonly={readonly}
                />
              );
            }}
          />
          <Controller
            key={OrganizationGeneralConfig.alias.key}
            name={OrganizationGeneralConfig.alias.key}
            rules={OrganizationGeneralConfig.alias.rules}
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <InputField
                  config={{
                    ...OrganizationGeneralConfig.alias.config,
                    error: errors[OrganizationGeneralConfig.alias.key]?.message,
                    defaultValue: value,
                    onChange: onChange,
                  }}
                  readonly={readonly}
                />
              );
            }}
          />
          <div className="w-1/2 gap-y-4 flex flex-col">
            <RadioGroup
              control={control}
              errors={errors[OrganizationGeneralConfig.type.key]}
              readonly={readonly}
              config={OrganizationGeneralConfig.type}
            />
            <Controller
              key={OrganizationGeneralConfig.email.key}
              name={OrganizationGeneralConfig.email.key}
              rules={OrganizationGeneralConfig.email.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <InputField
                    config={{
                      ...OrganizationGeneralConfig.email.config,
                      error: errors[OrganizationGeneralConfig.email.key]?.message,
                      defaultValue: value,
                      onChange: onChange,
                    }}
                    readonly={readonly}
                  />
                );
              }}
            />
            <Controller
              key={OrganizationGeneralConfig.yearCreated.key}
              name={OrganizationGeneralConfig.yearCreated.key}
              rules={OrganizationGeneralConfig.yearCreated.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <Select
                    config={{ ...OrganizationGeneralConfig.yearCreated.config }}
                    readonly={readonly}
                    selected={value}
                    onChange={onChange}
                  />
                );
              }}
            />
          </div>
          <div className="flex gap-4 ">
            <Controller
              key={OrganizationGeneralConfig.cui.key}
              name={OrganizationGeneralConfig.cui.key}
              rules={OrganizationGeneralConfig.cui.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <InputField
                    config={{
                      ...OrganizationGeneralConfig.cui.config,
                      error: errors[OrganizationGeneralConfig.cui.key]?.message,
                      defaultValue: value,
                      onChange: onChange,
                    }}
                    readonly={readonly}
                  />
                );
              }}
            />

            <Controller
              key={OrganizationGeneralConfig.rafNumber.key}
              name={OrganizationGeneralConfig.rafNumber.key}
              rules={OrganizationGeneralConfig.rafNumber.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <InputField
                    config={{
                      ...OrganizationGeneralConfig.rafNumber.config,
                      error: errors[OrganizationGeneralConfig.rafNumber.key]?.message,
                      defaultValue: value,
                      onChange: onChange,
                    }}
                    readonly={readonly}
                  />
                );
              }}
            />
          </div>
          <div className="w-full flex gap-4">
            <Controller
              key={OrganizationGeneralConfig.county.key}
              name={OrganizationGeneralConfig.county.key}
              rules={OrganizationGeneralConfig.county.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <Select
                    config={{ ...OrganizationGeneralConfig.county.config }}
                    readonly={readonly}
                    selected={value}
                    onChange={onChange}
                  />
                );
              }}
            />
            <Controller
              key={OrganizationGeneralConfig.city.key}
              name={OrganizationGeneralConfig.city.key}
              rules={OrganizationGeneralConfig.city.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <Select
                    config={{ ...OrganizationGeneralConfig.city.config }}
                    readonly={readonly}
                    selected={value}
                    onChange={onChange}
                  />
                );
              }}
            />
          </div>
          <Textarea readonly={readonly} config={{ ...OrganizationGeneralConfig.cui.config }} />
        </div>
        <div className="w-full flex flex-col items-center justify-center">
          <div className="rounded-full border-2 border-gray-100 h-80 w-80 relative flex items-center justify-center">
            <img
              src={
                'https://media-exp1.licdn.com/dms/image/C5603AQFivIhBWBWR9w/profile-displayphoto-shrink_200_200/0/1517276678882?e=1661990400&v=beta&t=3uinSQf4OI76lQOF7FkRVoYiZGKv0l_h33MYViddwiI'
              }
              className="w-11/12 h-11/12 overflow-hidden rounded-full"
            />
          </div>
          <span className="mt-8 text-blue-500 text-normal underline cursor-pointer select-none">
            Schimba fotografia
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrganizationGeneral;
