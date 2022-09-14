import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { fileToURL, flatten } from '../../../common/helpers/format.helper';
import ContactForm from '../../../components/Contact/Contact';
import InputField from '../../../components/InputField/InputField';
import RadioGroup from '../../../components/RadioGroup/RadioGroup';
import SectionHeader from '../../../components/section-header/SectionHeader';
import Select from '../../../components/Select/Select';
import Textarea from '../../../components/Textarea/Textarea';
import { useCitiesQuery } from '../../../services/nomenclature/Nomenclature.queries';
import { useNomenclature } from '../../../store/selectors';
import { OrganizationGeneralConfig } from '../../organization/components/OrganizationGeneral/OrganizationGeneralConfig';
import { CREATE_FLOW_URL } from '../constants/CreateOrganization.constant';

const CreateOrganizationGeneral = () => {
  const [readonly] = useState(false);
  const [county, setCounty] = useState<any>();
  const [city, setCity] = useState<any>();
  const { cities, counties } = useNomenclature();
  const [file, setFile] = useState<File | null>(null);

  const [organization, setOrganization] = useOutletContext<any>();

  const { t } = useTranslation(['general', 'common']);

  // queries
  useCitiesQuery(county?.id);

  const navigate = useNavigate();

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
    if (organization && organization.general) {
      const contact = flatten(organization.general.contact, {}, 'contact');
      reset({ ...organization.general, ...contact });
      setCounty(organization.general.county);
      setCity(organization.general.city);
      // setFile(organization.general.logo);
    }
  }, [organization]);

  useEffect(() => {
    if (county && !readonly) {
      setValue('city', null);
    }
  }, [cities]);

  const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      event.target.value = '';
    } else {
      event.target.value = '';
    }
  };

  const handleSave = (data: any) => {
    const contact = {
      ...data.contact,
      fullName: data.contact_fullName,
      phone: data.contact_phone,
      email: data.contact_email,
    };

    const organizationGeneral = {
      ...data,
      contact,
      logo: file,
    };

    setOrganization((org: any) => ({ ...org, general: organizationGeneral }));

    navigate(`/${CREATE_FLOW_URL.BASE}/${CREATE_FLOW_URL.ACTIVITY}`);
  };

  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="w-full " />
      <div className="p-5 sm:p-10 flex flex-col">
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
                <label htmlFor="photo" className="block text-normal font-normal text-gray-700">
                  {t('logo.name')}
                </label>
                <div className="mt-1 flex items-center">
                  <span className="h-20 w-20 rounded-full overflow-hidden bg-gray-100">
                    {!file ? (
                      <svg
                        className="h-full w-full text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ) : (
                      <img src={fileToURL(file) || ''} className="h-20 w-80" />
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
                <p className="mt-1 text-sm text-gray-500 font-normal" id="email-description">
                  {t('logo.description')}
                </p>
              </div>
              {/* End Logo */}
            </div>
            <div className="pt-8">
              <span className="text-xl font-bold text-gray-900">{t('contact.name')}</span>
              <p className="mt-1 mb-4 text-sm text-gray-500 font-normal" id="email-description">
                {t('contact.description')}
              </p>
              <ContactForm
                control={control}
                errors={errors}
                readonly={readonly}
                configs={[
                  OrganizationGeneralConfig.contact_name,
                  OrganizationGeneralConfig.contact_email,
                  OrganizationGeneralConfig.contact_phone,
                ]}
              />
            </div>
            <div className="pt-8">
              <span className="text-xl font-bold text-gray-900">{t('social')}</span>
              <p className="mt-1 mb-4 text-sm text-gray-500 font-normal" id="email-description">
                {t('information', { ns: 'common' })}
              </p>
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
              <span className="text-xl font-bold text-gray-900">{t('fundraising')}</span>
              <p className="mt-1 mb-4 text-sm text-gray-500 font-normal" id="email-description">
                {t('information', { ns: 'common' })}
              </p>
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
            onClick={() => navigate(`/${CREATE_FLOW_URL.BASE}/${CREATE_FLOW_URL.ACCOUNT}`)}
          >
            {t('back', { ns: 'common' })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateOrganizationGeneral;
