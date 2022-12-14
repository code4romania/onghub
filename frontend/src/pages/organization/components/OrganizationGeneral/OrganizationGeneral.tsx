import { PencilIcon } from '@heroicons/react/solid';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import { FILE_ERRORS } from '../../../../common/constants/error.constants';
import { fileToURL, flatten, setUrlPrefix } from '../../../../common/helpers/format.helper';
import { classNames } from '../../../../common/helpers/tailwind.helper';
import { useErrorToast } from '../../../../common/hooks/useToast';
import ContactForm from '../../../../components/Contact/Contact';
import InputField from '../../../../components/InputField/InputField';
import RadioGroup from '../../../../components/RadioGroup/RadioGroup';
import SectionHeader from '../../../../components/section-header/SectionHeader';
import Select from '../../../../components/Select/Select';
import Textarea from '../../../../components/Textarea/Textarea';
import { useAuthContext } from '../../../../contexts/AuthContext';
import { useCitiesQuery } from '../../../../services/nomenclature/Nomenclature.queries';
import { useNomenclature, useSelectedOrganization } from '../../../../store/selectors';
import { UserRole } from '../../../users/enums/UserRole.enum';
import { OrganizationContext } from '../../interfaces/OrganizationContext';
import { OrganizationGeneralConfig } from './OrganizationGeneralConfig';

const OrganizationGeneral = () => {
  const [readonly, setReadonly] = useState(true);
  const [county, setCounty] = useState<any>();
  const [city, setCity] = useState<any>();
  const [file, setFile] = useState<File | null>(null);
  const { cities, counties } = useNomenclature();
  const { disabled, updateOrganization } = useOutletContext<OrganizationContext>();
  const { role } = useAuthContext();

  const { organizationGeneral, organization } = useSelectedOrganization();

  // queries
  useCitiesQuery(county?.id);

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

  // React i18n
  const { t } = useTranslation(['general', 'organization', 'common']);

  useEffect(() => {
    if (organizationGeneral) {
      const contact = flatten(organizationGeneral.contact, {}, 'contact');
      reset({ ...organizationGeneral, ...contact });
      setCounty(organizationGeneral.county);
      setCity(organizationGeneral.city);
    }
  }, [organizationGeneral]);

  useEffect(() => {
    if (county && !readonly) {
      setValue('city', null);
    }
  }, [cities]);

  const startEdit = () => {
    setReadonly(false);
  };

  const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      event.target.value = '';
    } else {
      event.target.value = '';
    }
  };

  const handleSave = (data: any) => {
    const { contact_email, contact_fullName, contact_phone, contact, ...organizationGeneral } =
      data;

    setReadonly(true);

    const payload = {
      ...organizationGeneral,
      website: setUrlPrefix(organizationGeneral.website),
      facebook: setUrlPrefix(organizationGeneral.facebook),
      instagram: setUrlPrefix(organizationGeneral.instagram),
      twitter: setUrlPrefix(organizationGeneral.twitter),
      linkedin: setUrlPrefix(organizationGeneral.linkedin),
      tiktok: setUrlPrefix(organizationGeneral.tiktok),
      donationWebsite: setUrlPrefix(organizationGeneral.donationWebsite),
      redirectLink: setUrlPrefix(organizationGeneral.redirectLink),
      contact: {
        ...contact,
        fullName: contact_fullName,
        phone: contact_phone,
        email: contact_email,
      },
    };

    updateOrganization(
      {
        id: organization?.id as number,
        organization: {
          general: payload,
        },
        logo: file,
      },
      {
        onSuccess: () => {
          setFile(null);
        },
        onError: (error: any) => {
          const err = error.response.data;
          if (err.code) {
            useErrorToast(FILE_ERRORS[err.code]);
          } else {
            useErrorToast(t('save_error', { ns: 'organization' }));
          }
        },
      },
    );
  };

  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="py-5 lg:px-10 px-5 flex justify-between items-center">
        <span className="font-titilliumBold sm:text-lg lg:text-xl text-md text-gray-800">
          {t('title')}
        </span>

        {role !== UserRole.EMPLOYEE && (
          <button
            type="button"
            className={classNames(
              readonly ? 'edit-button' : 'save-button',
              'sm:text-sm lg:text-base text-xs',
            )}
            onClick={readonly ? startEdit : handleSubmit(handleSave)}
          >
            <PencilIcon className="-ml-1 mr-2 sm:h-5 sm:w-5 h-4 w-4" aria-hidden="true" />
            {readonly ? t('edit', { ns: 'common' }) : t('save', { ns: 'common' })}
          </button>
        )}
      </div>

      <div className="w-full border-t border-gray-300" />
      <div className="p-5 lg:p-10 flex">
        <div className="flex flex-col gap-4 w-full">
          <SectionHeader title={t('title')} subTitle={t('information', { ns: 'common' })} />
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
                        name: OrganizationGeneralConfig.alias.key,
                        error: errors[OrganizationGeneralConfig.alias.key]?.message,
                        defaultValue: value,
                        onChange: onChange,
                      }}
                      readonly={readonly}
                    />
                  );
                }}
              />
              <RadioGroup
                control={control}
                readonly={readonly}
                errors={errors[OrganizationGeneralConfig.type.key]}
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
                        name: OrganizationGeneralConfig.email.key,
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
                key={OrganizationGeneralConfig.phone.key}
                name={OrganizationGeneralConfig.phone.key}
                rules={OrganizationGeneralConfig.phone.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <InputField
                      config={{
                        ...OrganizationGeneralConfig.phone.config,
                        name: OrganizationGeneralConfig.phone.key,
                        error: errors[OrganizationGeneralConfig.phone.key]?.message,
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
                      config={{
                        ...OrganizationGeneralConfig.yearCreated.config,
                      }}
                      selected={value}
                      onChange={onChange}
                      readonly={readonly}
                      disabled={disabled}
                    />
                  );
                }}
              />
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
                        name: OrganizationGeneralConfig.cui.key,
                        error: errors[OrganizationGeneralConfig.cui.key]?.message,
                        defaultValue: value,
                        onChange: onChange,
                      }}
                      readonly={readonly}
                      disabled={disabled}
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
                        name: OrganizationGeneralConfig.rafNumber.key,
                        error: errors[OrganizationGeneralConfig.rafNumber.key]?.message,
                        defaultValue: value,
                        onChange: onChange,
                      }}
                      readonly={readonly}
                      disabled={disabled}
                    />
                  );
                }}
              />
              <div className="flex gap-4">
                <Controller
                  key={OrganizationGeneralConfig.county.key}
                  name={OrganizationGeneralConfig.county.key}
                  rules={OrganizationGeneralConfig.county.rules}
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <Select
                        config={{
                          ...OrganizationGeneralConfig.county.config,
                          collection: counties,
                          displayedAttribute: 'name',
                        }}
                        error={errors[OrganizationGeneralConfig.county.key]?.message}
                        selected={value}
                        onChange={(e: any) => {
                          onChange(e);
                          setCounty(e);
                        }}
                        readonly={readonly}
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
                        config={{
                          ...OrganizationGeneralConfig.city.config,
                          collection: cities || [],
                          displayedAttribute: 'name',
                        }}
                        error={errors[OrganizationGeneralConfig.city.key]?.message}
                        selected={value}
                        onChange={onChange}
                        readonly={readonly}
                      />
                    );
                  }}
                />
              </div>
              <Controller
                key={OrganizationGeneralConfig.shortDescription.key}
                name={OrganizationGeneralConfig.shortDescription.key}
                rules={OrganizationGeneralConfig.shortDescription.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <Textarea
                      config={{
                        ...OrganizationGeneralConfig.shortDescription.config,
                        name: OrganizationGeneralConfig.shortDescription.key,
                        error: errors[OrganizationGeneralConfig.shortDescription.key]?.message,
                        defaultValue: value,
                        onChange: onChange,
                      }}
                      readonly={readonly}
                    />
                  );
                }}
              />
              <Controller
                key={OrganizationGeneralConfig.description.key}
                name={OrganizationGeneralConfig.description.key}
                rules={OrganizationGeneralConfig.description.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <Textarea
                      config={{
                        ...OrganizationGeneralConfig.description.config,
                        name: OrganizationGeneralConfig.description.key,
                        error: errors[OrganizationGeneralConfig.description.key]?.message,
                        defaultValue: value,
                        onChange: onChange,
                      }}
                      readonly={readonly}
                    />
                  );
                }}
              />

              {/*  Logo */}
              <div className="sm:col-span-6 gap-4 flex flex-col">
                <label
                  htmlFor="photo"
                  className="block sm:text-sm lg:text-base text-xs font-normal text-gray-700"
                >
                  {t('logo.name')}
                </label>

                <div className="mt-1 flex items-center">
                  <span className="h-20 w-20 rounded-full overflow-hidden bg-gray-100">
                    {!file && !organizationGeneral?.logo ? (
                      <svg
                        className="h-full w-full text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ) : (
                      <img
                        src={fileToURL(file) || (organizationGeneral?.logo as string)}
                        className="h-20 w-80"
                      />
                    )}
                  </span>
                  {!readonly && (
                    <>
                      <label
                        htmlFor="uploadPhoto"
                        className="cursor-pointer ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {t('logo.upload')}
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
                {!readonly && (
                  <p className="mt-1 text-sm text-gray-500 font-normal" id="email-description">
                    {t('logo.description')}
                  </p>
                )}
              </div>
              {/* End Logo */}
            </div>
            <div className="pt-8">
              <div className="pb-5">
                <span className="sm:text-lg lg:text-xl text-md font-bold text-gray-900">
                  {t('contact.name')}
                </span>
                {!readonly && (
                  <p className="mt-1 mb-4 text-sm text-gray-500 font-normal" id="email-description">
                    {t('contact.description')}
                  </p>
                )}
              </div>

              <ContactForm
                control={control}
                errors={errors}
                readonly={readonly}
                configs={[
                  OrganizationGeneralConfig.contact_name,
                  OrganizationGeneralConfig.contact_email,
                  OrganizationGeneralConfig.contact_phone,
                ]}
                disabled={disabled}
              />
            </div>
            <div className="pt-8">
              <div className="pb-5">
                <span className="sm:text-lg lg:text-xl text-md font-bold text-gray-900">
                  {t('social')}
                </span>
                {!readonly && (
                  <p className="mt-1 mb-4 text-sm text-gray-500 font-normal" id="email-description">
                    {t('information', { ns: 'common' })}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <Controller
                  key={OrganizationGeneralConfig.website.key}
                  name={OrganizationGeneralConfig.website.key}
                  rules={OrganizationGeneralConfig.website.rules}
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <InputField
                        config={{
                          ...OrganizationGeneralConfig.website.config,
                          name: OrganizationGeneralConfig.website.key,
                          error: errors[OrganizationGeneralConfig.website.key]?.message,
                          defaultValue: value,
                          onChange: onChange,
                        }}
                        readonly={readonly}
                      />
                    );
                  }}
                />
                <Controller
                  key={OrganizationGeneralConfig.facebook.key}
                  name={OrganizationGeneralConfig.facebook.key}
                  rules={OrganizationGeneralConfig.facebook.rules}
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <InputField
                        config={{
                          ...OrganizationGeneralConfig.facebook.config,
                          name: OrganizationGeneralConfig.facebook.key,
                          error: errors[OrganizationGeneralConfig.facebook.key]?.message,
                          defaultValue: value,
                          onChange: onChange,
                        }}
                        readonly={readonly}
                      />
                    );
                  }}
                />
                <Controller
                  key={OrganizationGeneralConfig.instagram.key}
                  name={OrganizationGeneralConfig.instagram.key}
                  rules={OrganizationGeneralConfig.instagram.rules}
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <InputField
                        config={{
                          ...OrganizationGeneralConfig.instagram.config,
                          name: OrganizationGeneralConfig.instagram.key,
                          error: errors[OrganizationGeneralConfig.instagram.key]?.message,
                          defaultValue: value,
                          onChange: onChange,
                        }}
                        readonly={readonly}
                      />
                    );
                  }}
                />
                <Controller
                  key={OrganizationGeneralConfig.twitter.key}
                  name={OrganizationGeneralConfig.twitter.key}
                  rules={OrganizationGeneralConfig.twitter.rules}
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <InputField
                        config={{
                          ...OrganizationGeneralConfig.twitter.config,
                          name: OrganizationGeneralConfig.twitter.key,
                          error: errors[OrganizationGeneralConfig.twitter.key]?.message,
                          defaultValue: value,
                          onChange: onChange,
                        }}
                        readonly={readonly}
                      />
                    );
                  }}
                />
                <Controller
                  key={OrganizationGeneralConfig.linkedin.key}
                  name={OrganizationGeneralConfig.linkedin.key}
                  rules={OrganizationGeneralConfig.linkedin.rules}
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <InputField
                        config={{
                          ...OrganizationGeneralConfig.linkedin.config,
                          name: OrganizationGeneralConfig.linkedin.key,
                          error: errors[OrganizationGeneralConfig.linkedin.key]?.message,
                          defaultValue: value,
                          onChange: onChange,
                        }}
                        readonly={readonly}
                      />
                    );
                  }}
                />
                <Controller
                  key={OrganizationGeneralConfig.tiktok.key}
                  name={OrganizationGeneralConfig.tiktok.key}
                  rules={OrganizationGeneralConfig.tiktok.rules}
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <InputField
                        config={{
                          ...OrganizationGeneralConfig.tiktok.config,
                          name: OrganizationGeneralConfig.tiktok.key,
                          error: errors[OrganizationGeneralConfig.tiktok.key]?.message,
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
            <div className="pt-8">
              <div className="pb-5">
                <span className="sm:text-lg lg:text-xl text-md font-bold text-gray-900">
                  {t('fundraising')}
                </span>
                {!readonly && (
                  <p className="mt-1 mb-4 text-sm text-gray-500 font-normal" id="email-description">
                    {t('information', { ns: 'common' })}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <Controller
                  key={OrganizationGeneralConfig.donationWebsite.key}
                  name={OrganizationGeneralConfig.donationWebsite.key}
                  rules={OrganizationGeneralConfig.donationWebsite.rules}
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <InputField
                        config={{
                          ...OrganizationGeneralConfig.donationWebsite.config,
                          name: OrganizationGeneralConfig.donationWebsite.key,
                          error: errors[OrganizationGeneralConfig.donationWebsite.key]?.message,
                          defaultValue: value,
                          onChange: onChange,
                        }}
                        readonly={readonly}
                      />
                    );
                  }}
                />
                <Controller
                  key={OrganizationGeneralConfig.redirectLink.key}
                  name={OrganizationGeneralConfig.redirectLink.key}
                  rules={OrganizationGeneralConfig.redirectLink.rules}
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <InputField
                        config={{
                          ...OrganizationGeneralConfig.redirectLink.config,
                          name: OrganizationGeneralConfig.redirectLink.key,
                          error: errors[OrganizationGeneralConfig.redirectLink.key]?.message,
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
                    key={OrganizationGeneralConfig.donationSMS.key}
                    name={OrganizationGeneralConfig.donationSMS.key}
                    rules={OrganizationGeneralConfig.donationSMS.rules}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <InputField
                          config={{
                            ...OrganizationGeneralConfig.donationSMS.config,
                            name: OrganizationGeneralConfig.donationSMS.key,
                            error: errors[OrganizationGeneralConfig.donationSMS.key]?.message,
                            defaultValue: value,
                            onChange: onChange,
                          }}
                          readonly={readonly}
                        />
                      );
                    }}
                  />
                  <Controller
                    key={OrganizationGeneralConfig.donationKeyword.key}
                    name={OrganizationGeneralConfig.donationKeyword.key}
                    rules={OrganizationGeneralConfig.donationKeyword.rules}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <InputField
                          config={{
                            ...OrganizationGeneralConfig.donationKeyword.config,
                            name: OrganizationGeneralConfig.donationKeyword.key,
                            error: errors[OrganizationGeneralConfig.donationKeyword.key]?.message,
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrganizationGeneral;
