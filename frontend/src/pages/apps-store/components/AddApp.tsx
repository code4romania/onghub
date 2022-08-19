import { PencilIcon } from '@heroicons/react/outline';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../../../common/helpers/tailwind.helper';
import ContentWrapper from '../../../components/content-wrapper/ContentWrapper';
import InputField from '../../../components/InputField/InputField';
import SectionHeader from '../../../components/section-header/SectionHeader';
import { OrganizationGeneralConfig } from '../../organization/components/OrganizationGeneral/OrganizationGeneralConfig';

const AddApp = () => {
  const navigate = useNavigate();
  const [readonly, setReadonly] = useState(true);
  const [isEdit, setEdit] = useState(false);

  // React Hook Form
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const handleSave = () => {
    console.log('here');
  };

  const startEdit = () => {
    setReadonly(false);
  };

  return (
    <ContentWrapper
      title="Adauga aplicatie"
      subtitle="Lorem ipsum. Administrează de aici profilul tău de organizație pentru a putea accesa aplicațiile disponibile."
      goBack={() => navigate('/store')}
    >
      <div className="w-full bg-white shadow rounded-lg mt-4">
        <div className="py-5 px-10 flex justify-between">
          <span className="font-titilliumBold text-xl text-gray-800">
            {isEdit ? 'Editare pagina aplicatie' : 'Generare pagina aplicatie'}
          </span>

          <button
            type="button"
            className={classNames(readonly ? 'edit-button' : 'save-button')}
            onClick={readonly ? startEdit : handleSave}
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
            <form className="space-y-8 xl:w-1/3 divide-y divide-gray-200 divide-">
              <div className="flex flex-col gap-4">
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
                          name: OrganizationGeneralConfig.name.key,
                          error: errors[OrganizationGeneralConfig.name.key]?.message,
                          defaultValue: value,
                          onChange: onChange,
                        }}
                        readonly={readonly}
                      />
                    );
                  }}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default AddApp;
