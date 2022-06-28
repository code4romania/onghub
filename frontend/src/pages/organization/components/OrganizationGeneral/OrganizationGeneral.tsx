import React, { useEffect, useState } from 'react';
import { ExclamationCircleIcon, PencilIcon } from '@heroicons/react/solid';
import { classNames } from '../../../../common/helpers/tailwind.helper';
import { Controller, useForm } from 'react-hook-form';
import InputField from '../../../../components/InputField/InputField';
import InputFieldHttpAddon from '../../../../components/InputField/components/InputFieldHttpAddon';
import { OrganizationGeneralConfig } from './OrganizationGeneralConfig';

const OrganizationGeneral = () => {
  const [isEditMode, setEditMode] = useState(false);

  // React Hook Form
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({ mode: 'onChange', reValidateMode: 'onChange' });

  const handleSave = () => {
    setEditMode((mode) => !mode);
  };

  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="p-5 sm:p-10 flex justify-between">
        <span className="font-titilliumBold text-xl text-gray-800">Date generale</span>

        <button
          type="button"
          className={classNames(isEditMode ? 'save-button' : 'edit-button')}
          onClick={handleSave}
        >
          <PencilIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          {isEditMode ? 'Salveaza modificari' : 'Editeaza'}
        </button>
      </div>

      <div className="w-full border-t border-gray-300" />
      <div className="p-5 sm:p-10 flex">
        <div className="flex flex-col gap-y-4 w-full">
          <span className="font-bold text-default-gray-800">General</span>
          <Controller
            name={OrganizationGeneralConfig.name.key}
            rules={OrganizationGeneralConfig.name.rules}
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <InputField
                  config={{
                    ...OrganizationGeneralConfig.name.config,
                    name: OrganizationGeneralConfig.name.key,
                    error: errors[OrganizationGeneralConfig?.name?.key]?.message,
                    defaultValue: value,
                    onChange: onChange,
                  }}
                />
              );
            }}
          />
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
