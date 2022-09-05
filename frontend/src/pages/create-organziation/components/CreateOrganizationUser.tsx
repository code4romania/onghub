import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useOutletContext, useNavigate } from 'react-router-dom';
import InputField from '../../../components/InputField/InputField';
import SectionHeader from '../../../components/section-header/SectionHeader';
import { CreateOrganizationUserConfig } from '../configs/CreateOrganizationUserConfig';
import { CREATE_FLOW_URL } from '../constants/CreateOrganization.constant';

const CreateOrganizationUser = () => {
  const [readonly] = useState(false);

  const [organization, setOrganization] = useOutletContext<any>();

  const navigate = useNavigate();

  const { t } = useTranslation(['user', 'common']);

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

  useEffect(() => {
    if (organization && organization.admin) {
      reset({ ...organization.admin });
    }
  }, [organization]);

  const handleSave = (data: any) => {
    const admin = {
      ...data,
    };

    setOrganization((org: any) => ({ ...org, admin }));

    navigate(`/${CREATE_FLOW_URL.BASE}/${CREATE_FLOW_URL.GENERAL}`);
  };

  return (
    <div className="w-full bg-white shadow rounded-lg m-1">
      <div className="w-full " />
      <div className="p-5 sm:p-10 flex flex-col">
        <div className="flex flex-col gap-4 w-full">
          <SectionHeader
            title={t('create_org.title')}
            subTitle={t('information', { ns: 'common' })}
          />
          <form className="space-y-8 xl:w-1/2 divide-y divide-gray-200 divide-">
            <div className="flex flex-col gap-4">
              <Controller
                key={CreateOrganizationUserConfig.name.key}
                name={CreateOrganizationUserConfig.name.key}
                rules={CreateOrganizationUserConfig.name.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <InputField
                      config={{
                        ...CreateOrganizationUserConfig.name.config,
                        name: CreateOrganizationUserConfig.name.key,
                        error: errors[CreateOrganizationUserConfig.name.key]?.message,
                        defaultValue: value,
                        onChange: onChange,
                      }}
                      readonly={readonly}
                    />
                  );
                }}
              />
              <div className="flex gap-4">
                <Controller
                  key={CreateOrganizationUserConfig.email.key}
                  name={CreateOrganizationUserConfig.email.key}
                  rules={CreateOrganizationUserConfig.email.rules}
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <InputField
                        config={{
                          ...CreateOrganizationUserConfig.email.config,
                          name: CreateOrganizationUserConfig.email.key,
                          error: errors[CreateOrganizationUserConfig.email.key]?.message,
                          defaultValue: value,
                          onChange: onChange,
                        }}
                        readonly={readonly}
                      />
                    );
                  }}
                />
                <Controller
                  key={CreateOrganizationUserConfig.phone.key}
                  name={CreateOrganizationUserConfig.phone.key}
                  rules={CreateOrganizationUserConfig.phone.rules}
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <InputField
                        config={{
                          ...CreateOrganizationUserConfig.phone.config,
                          name: CreateOrganizationUserConfig.phone.key,
                          error: errors[CreateOrganizationUserConfig.phone.key]?.message,
                          defaultValue: value,
                          onChange: onChange,
                        }}
                        readonly={readonly}
                      />
                    );
                  }}
                />
              </div>
            </div>
          </form>
        </div>
        <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-black hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={handleSubmit(handleSave)}
          >
            {t('next', { ns: 'common' })}
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={() => alert('not implemented')}
          >
            {t('back', { ns: 'common' })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganizationUser;
