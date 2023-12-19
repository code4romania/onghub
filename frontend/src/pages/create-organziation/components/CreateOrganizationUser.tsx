import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { InternalErrors } from '../../../common/errors/internal-errors';
import { updateActiveStepIndexInLocalStorage } from '../../../common/helpers/utils.helper';
import { useInitStep } from '../../../common/hooks/useInitStep';
import InputField from '../../../components/InputField/InputField';
import ErrorsBanner from '../../../components/errors-banner/ErrorsBanner';
import SectionHeader from '../../../components/section-header/SectionHeader';
import { useCreateOrganizationRequestValidationMutation } from '../../../services/request/Request.queries';
import { CreateOrganizationUserConfig } from '../configs/CreateOrganizationUserConfig';
import {
  CREATE_FLOW_URL,
  CREATE_LOCAL_STORAGE_KEY,
} from '../constants/CreateOrganization.constant';
import GenericFormErrorMessage from '../../../components/generic-form-error-message/GenericFormErrorMessage';

const CreateOrganizationUser = () => {
  const [readonly] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const [organization, setOrganization, , , , , activeStepIndex, setActiveStepIndex] =
    useOutletContext<any>();

  useInitStep(setOrganization);

  const navigate = useNavigate();

  const { t } = useTranslation(['user', 'common']);

  // React Hook Form
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitted, errors, isValidating },
    watch,
    getValues,
    reset,
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  //Store form data in local storage
  const watchAllFields = watch();
  useEffect(() => {
    if (activeStepIndex > 0) {
      return;
    }
    const admin = getValues();
    //Prevent filling localStorage with undefined data and prevent filling it with erros
    const hasAdminValues = !!Object.values(admin).filter((item) => item !== undefined).length;
    const hasFieldErrors = !!Object.keys(errors).length;

    //Using isValidating because RHF triggers 2 renders and update local storage with invalid data
    if (hasAdminValues && !isValidating && !hasFieldErrors) {
      localStorage.setItem(CREATE_LOCAL_STORAGE_KEY, JSON.stringify({ ...organization, admin }));
    }
  }, [watchAllFields]);

  const { mutateAsync: validationMutate } = useCreateOrganizationRequestValidationMutation();

  //Init for fields
  useEffect(() => {
    if (organization && organization.admin) {
      reset({ ...organization.admin });
    }
  }, [organization]);

  const handleSave = async (data: any) => {
    try {
      await validationMutate({ admin: { ...data } }); // Throws errors

      const admin = {
        ...data,
      };

      setOrganization((org: any) => ({ ...org, admin }));
      localStorage.setItem(CREATE_LOCAL_STORAGE_KEY, JSON.stringify({ ...organization, admin }));
      navigate(`/${CREATE_FLOW_URL.BASE}/${CREATE_FLOW_URL.GENERAL}`);
      updateActiveStepIndexInLocalStorage(activeStepIndex, 1, setActiveStepIndex);
    } catch (err: any) {
      const response = err.response?.data?.message;
      if (Array.isArray(response)) {
        const mappedErrors = response.map((error) =>
          InternalErrors.createOrganizationErrors.getError(error?.response?.errorCode),
        );
        setValidationErrors(mappedErrors);
      }
    }
  };

  return (
    <div className="w-full bg-white shadow rounded-lg m-1">
      <div className="w-full " />
      <div className="p-5 sm:p-10 flex flex-col">
        <div className="flex flex-col gap-4 w-full">
          <SectionHeader title={t('create_org.title')} subTitle={t('general:title_information')} />
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
                        id: 'create-organization-account__name',
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
                          id: 'create-organization-account__email',
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
                          id: 'create-organization-account__phone',
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
            aria-label={t('next', { ns: 'common' })}
            id="create-organization-account__button-next"
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 sm:text-sm lg:text-base text-xs font-medium text-black hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto"
            onClick={handleSubmit(handleSave)}
          >
            {t('next', { ns: 'common' })}
          </button>
        </div>
        {!isValid && isSubmitted && <GenericFormErrorMessage />}
        {validationErrors.length > 0 && (
          <ErrorsBanner errors={validationErrors} onClose={() => setValidationErrors([])} />
        )}
      </div>
    </div>
  );
};

export default CreateOrganizationUser;
