import { compareAsc } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Control, Controller, DeepRequired, FieldErrorsImpl, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { mapCitiesToSelect } from '../../../common/helpers/format.helper';
import ChipSelection from '../../../components/chip-selection/ChipSelection';
import DatePickerInput from '../../../components/date-picker-input/DatePickerInput';
import InputField from '../../../components/InputField/InputField';
import RichText from '../../../components/RichText/RichText';
import ServerSelect from '../../../components/server-select/ServerSelect';
import Textarea from '../../../components/Textarea/Textarea';
import Toggle from '../../../components/toggle/Toggle';
import { CivicCenterServicePayload } from '../../../services/civic-center-service/interfaces/civic-center-service-payload.interface';
import { useDomainsQuery } from '../../../services/nomenclature/Nomenclature.queries';
import { getCities } from '../../../services/nomenclature/Nomenclatures.service';
import { useNomenclature } from '../../../store/nomenclature/nomenclature.selectors';
import { CivicCenterFormConfig } from '../config/CivicCenterFormConfig';
import { ageCategories } from '../constants/age-categories.constants';
import SubsectionHeader from './SubsectionHeader';

interface CivicCenterFormProps {
  control: Control<CivicCenterServicePayload, object>;
  errors: FieldErrorsImpl<DeepRequired<CivicCenterServicePayload>>;
  watch: UseFormWatch<CivicCenterServicePayload>;
  onChangeFormValidity: (isValid: boolean) => void;
}

const CivicCenterForm = ({
  control,
  errors,
  watch,
  onChangeFormValidity,
}: CivicCenterFormProps) => {
  const { domains } = useNomenclature();

  // component state
  const [civicCenterProgramPeriodError, setCivicCenterPeriodError] = useState<string>();
  const [civicCenterMandatoryAccessError, setCivicCenterMandatoryAccessError] = useState<string>();

  // load nomenclature data
  useDomainsQuery();

  // translarions
  const { t } = useTranslation(['civic_center_service']);

  // watchers
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const isPeriodNotDetermined = watch('isPeriodNotDetermined');
  const hasOnlineAccess = watch('hasOnlineAccess');
  const hasEmailPhoneAccess = watch('hasEmailPhoneAccess');
  const hasPhysicalAccess = watch('hasPhysicalAccess');

  useEffect(() => {
    // check if practice program end date is after start date
    if (startDate && endDate && compareAsc(startDate, endDate) === 1 && !isPeriodNotDetermined) {
      // set practice program period error on both date picker inputs
      setCivicCenterPeriodError(t('form.end_date.start_date_after_end_date'));
    } else {
      // reset error
      setCivicCenterPeriodError(undefined);
    }
  }, [startDate, endDate, isPeriodNotDetermined]);

  useEffect(() => {
    if (!hasOnlineAccess && !hasEmailPhoneAccess && !hasPhysicalAccess) {
      setCivicCenterMandatoryAccessError(t('form.access.mandatory'));
    } else {
      // reset error
      setCivicCenterMandatoryAccessError(undefined);
    }
  }, [hasOnlineAccess, hasEmailPhoneAccess, hasPhysicalAccess]);

  useEffect(() => {
    // update additional validatity flag for period
    onChangeFormValidity(!(civicCenterProgramPeriodError || civicCenterMandatoryAccessError));
  }, [civicCenterProgramPeriodError, civicCenterMandatoryAccessError]);

  const loadOptionsCitiesSerch = async (searchWord: string) => {
    return getCities(searchWord).then((res) => res.map(mapCitiesToSelect));
  };

  return (
    <div className="p-5 sm:p-10 flex">
      <div className="flex flex-col gap-4 w-full">
        <form className="space-y-8 xxl:w-1/3 xl:w-1/2 divide-y divide-gray-200 divide-">
          <div className="divide-y divide-gray-200 flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <Controller
                key={CivicCenterFormConfig.name.key}
                name={CivicCenterFormConfig.name.key}
                rules={CivicCenterFormConfig.name.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <InputField
                      config={{
                        ...CivicCenterFormConfig.name.config,
                        name: CivicCenterFormConfig.name.key,
                        error: errors.name?.message,
                        defaultValue: value,
                        onChange: onChange,
                      }}
                    />
                  );
                }}
              />
              <Controller
                key={CivicCenterFormConfig.location.key}
                name={CivicCenterFormConfig.location.key}
                rules={CivicCenterFormConfig.location.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <ServerSelect
                      id="civic-center-service-form__cities"
                      value={value}
                      label={CivicCenterFormConfig.location.label}
                      isClearable={false}
                      placeholder={CivicCenterFormConfig.location.placeholder}
                      helperText={CivicCenterFormConfig.location.helperText}
                      error={(errors as Record<string, { message: string }>)[
                        CivicCenterFormConfig.location.key
                      ]?.message?.toString()}
                      onChange={onChange}
                      loadOptions={loadOptionsCitiesSerch}
                    />
                  );
                }}
              />
              <Controller
                key={CivicCenterFormConfig.startDate.key}
                name={CivicCenterFormConfig.startDate.key}
                rules={CivicCenterFormConfig.startDate.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <DatePickerInput
                      {...CivicCenterFormConfig.startDate.config}
                      value={value}
                      onChange={onChange}
                      error={
                        (errors as Record<string, { message: string }>)[
                          CivicCenterFormConfig.startDate.key
                        ]?.message?.toString() || civicCenterProgramPeriodError
                      }
                    />
                  );
                }}
              />
              {!isPeriodNotDetermined && (
                <Controller
                  key={CivicCenterFormConfig.endDate.key}
                  name={CivicCenterFormConfig.endDate.key}
                  rules={CivicCenterFormConfig.endDate.rules}
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <DatePickerInput
                        {...CivicCenterFormConfig.endDate.config}
                        value={value}
                        onChange={onChange}
                        error={
                          (errors as Record<string, { message: string }>)[
                            CivicCenterFormConfig.endDate.key
                          ]?.message?.toString() || civicCenterProgramPeriodError
                        }
                      />
                    );
                  }}
                />
              )}
              <Controller
                key={CivicCenterFormConfig.isPeriodNotDetermined.key}
                name={CivicCenterFormConfig.isPeriodNotDetermined.key}
                rules={CivicCenterFormConfig.isPeriodNotDetermined.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <InputField
                      config={{
                        ...CivicCenterFormConfig.isPeriodNotDetermined.config,
                        name: CivicCenterFormConfig.isPeriodNotDetermined.key,
                        error: errors.isPeriodNotDetermined?.message,
                        defaultValue: value,
                        onChange: onChange,
                      }}
                    />
                  );
                }}
              />
              <Controller
                key={CivicCenterFormConfig.shortDescription.key}
                name={CivicCenterFormConfig.shortDescription.key}
                rules={CivicCenterFormConfig.shortDescription.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <Textarea
                      config={{
                        ...CivicCenterFormConfig.shortDescription.config,
                        name: CivicCenterFormConfig.shortDescription.key,
                        error: errors.shortDescription?.message,
                        defaultValue: value,
                        onChange: onChange,
                      }}
                    />
                  );
                }}
              />
              <Controller
                key={CivicCenterFormConfig.longDescription.key}
                name={CivicCenterFormConfig.longDescription.key}
                rules={CivicCenterFormConfig.longDescription.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <Textarea
                      config={{
                        ...CivicCenterFormConfig.longDescription.config,
                        name: CivicCenterFormConfig.longDescription.key,
                        error: errors.longDescription?.message,
                        defaultValue: value,
                        onChange: onChange,
                      }}
                    />
                  );
                }}
              />
              <Controller
                key={CivicCenterFormConfig.domains.key}
                name={CivicCenterFormConfig.domains.key}
                rules={CivicCenterFormConfig.domains.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <ChipSelection
                      id="civic-center-service-form__domains"
                      {...CivicCenterFormConfig.domains.config}
                      values={[...domains]}
                      defaultItems={value}
                      error={(errors as Record<string, { message: string }>)[
                        CivicCenterFormConfig.domains.key
                      ]?.message?.toString()}
                      onItemsChange={onChange}
                    ></ChipSelection>
                  );
                }}
              />
              <Controller
                key={CivicCenterFormConfig.ageCategories.key}
                name={CivicCenterFormConfig.ageCategories.key}
                rules={CivicCenterFormConfig.ageCategories.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <ChipSelection
                      id="civic-center-service-form__ageCategories"
                      {...CivicCenterFormConfig.ageCategories.config}
                      values={ageCategories}
                      defaultItems={value}
                      error={(errors as Record<string, { message: string }>)[
                        CivicCenterFormConfig.ageCategories.key
                      ]?.message?.toString()}
                      onItemsChange={onChange}
                    ></ChipSelection>
                  );
                }}
              />
            </div>
            <div className="flex flex-col gap-4 py-8">
              <SubsectionHeader
                title={t('form.section.online.title')}
                description={t('form.section.online.description')}
              />
              <Controller
                key={CivicCenterFormConfig.online.hasOnlineAccess.key}
                name={CivicCenterFormConfig.online.hasOnlineAccess.key}
                rules={CivicCenterFormConfig.online.hasOnlineAccess.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <Toggle
                      value={value}
                      onChange={onChange}
                      label={CivicCenterFormConfig.online.hasOnlineAccess.label.label}
                      error={civicCenterMandatoryAccessError}
                    />
                  );
                }}
              />
              {hasOnlineAccess && (
                <>
                  <Controller
                    key={CivicCenterFormConfig.online.link.key}
                    name={CivicCenterFormConfig.online.link.key}
                    rules={CivicCenterFormConfig.online.link.rules}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <InputField
                          config={{
                            ...CivicCenterFormConfig.online.link.config,
                            name: CivicCenterFormConfig.online.link.key,
                            error: (errors as Record<string, { message: string }>)[
                              CivicCenterFormConfig.online.link.key
                            ]?.message,
                            defaultValue: value,
                            onChange: onChange,
                          }}
                          disabled={!hasOnlineAccess}
                        />
                      );
                    }}
                  />
                  <Controller
                    key={CivicCenterFormConfig.online.description.key}
                    name={CivicCenterFormConfig.online.description.key}
                    rules={CivicCenterFormConfig.online.description.rules}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <Textarea
                          config={{
                            ...CivicCenterFormConfig.online.description.config,
                            name: CivicCenterFormConfig.online.description.key,
                            error: errors.onlineAccessDescription?.message,
                            defaultValue: value,
                            onChange: onChange,
                          }}
                          disabled={!hasOnlineAccess}
                        />
                      );
                    }}
                  />
                </>
              )}
            </div>
            <div className="flex flex-col gap-4 py-8">
              <SubsectionHeader
                title={t('form.section.email_or_phone.title')}
                description={t('form.section.email_or_phone.description')}
              />
              <Controller
                key={CivicCenterFormConfig.emailOrPhone.hasEmailPhoneAccess.key}
                name={CivicCenterFormConfig.emailOrPhone.hasEmailPhoneAccess.key}
                rules={CivicCenterFormConfig.emailOrPhone.hasEmailPhoneAccess.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <Toggle
                      value={value}
                      onChange={onChange}
                      label={CivicCenterFormConfig.emailOrPhone.hasEmailPhoneAccess.label.label}
                      error={civicCenterMandatoryAccessError}
                    />
                  );
                }}
              />
              {hasEmailPhoneAccess && (
                <>
                  <Controller
                    key={CivicCenterFormConfig.emailOrPhone.email.key}
                    name={CivicCenterFormConfig.emailOrPhone.email.key}
                    rules={CivicCenterFormConfig.emailOrPhone.email.rules}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <InputField
                          config={{
                            ...CivicCenterFormConfig.emailOrPhone.email.config,
                            name: CivicCenterFormConfig.emailOrPhone.email.key,
                            error: (errors as Record<string, { message: string }>)[
                              CivicCenterFormConfig.emailOrPhone.email.key
                            ]?.message,
                            defaultValue: value,
                            onChange: onChange,
                            id: 'create-civic-center-service__email',
                          }}
                          disabled={!hasEmailPhoneAccess}
                        />
                      );
                    }}
                  />
                  <Controller
                    key={CivicCenterFormConfig.emailOrPhone.phone.key}
                    name={CivicCenterFormConfig.emailOrPhone.phone.key}
                    rules={CivicCenterFormConfig.emailOrPhone.phone.rules}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <InputField
                          config={{
                            ...CivicCenterFormConfig.emailOrPhone.phone.config,
                            name: CivicCenterFormConfig.emailOrPhone.phone.key,
                            error: (errors as Record<string, { message: string }>)[
                              CivicCenterFormConfig.emailOrPhone.phone.key
                            ]?.message,
                            defaultValue: value,
                            onChange: onChange,
                            id: 'create-organization-general__org-phone',
                          }}
                          disabled={!hasEmailPhoneAccess}
                        />
                      );
                    }}
                  />
                  <Controller
                    key={CivicCenterFormConfig.emailOrPhone.description.key}
                    name={CivicCenterFormConfig.emailOrPhone.description.key}
                    rules={CivicCenterFormConfig.emailOrPhone.description.rules}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <Textarea
                          config={{
                            ...CivicCenterFormConfig.emailOrPhone.description.config,
                            name: CivicCenterFormConfig.emailOrPhone.description.key,
                            error: (errors as Record<string, { message: string }>)[
                              CivicCenterFormConfig.emailOrPhone.description.key
                            ]?.message,
                            defaultValue: value,
                            onChange: onChange,
                          }}
                          disabled={!hasEmailPhoneAccess}
                        />
                      );
                    }}
                  />
                </>
              )}
            </div>
            <div className="flex flex-col gap-4 py-8">
              <SubsectionHeader
                title={t('form.section.physical.title')}
                description={t('form.section.physical.description')}
              />
              <Controller
                key={CivicCenterFormConfig.physical.hasPhysicalAccess.key}
                name={CivicCenterFormConfig.physical.hasPhysicalAccess.key}
                rules={CivicCenterFormConfig.physical.hasPhysicalAccess.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <Toggle
                      value={value}
                      onChange={onChange}
                      label={CivicCenterFormConfig.physical.hasPhysicalAccess.label.label}
                      error={civicCenterMandatoryAccessError}
                    />
                  );
                }}
              />
              {hasPhysicalAccess && (
                <>
                  <Controller
                    key={CivicCenterFormConfig.physical.address.key}
                    name={CivicCenterFormConfig.physical.address.key}
                    rules={CivicCenterFormConfig.physical.address.rules}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <InputField
                          config={{
                            ...CivicCenterFormConfig.physical.address.config,
                            name: CivicCenterFormConfig.physical.address.key,
                            error: (errors as Record<string, { message: string }>)[
                              CivicCenterFormConfig.physical.address.key
                            ]?.message,
                            defaultValue: value,
                            onChange: onChange,
                          }}
                          disabled={!hasPhysicalAccess}
                        />
                      );
                    }}
                  />
                  <Controller
                    key={CivicCenterFormConfig.physical.description.key}
                    name={CivicCenterFormConfig.physical.description.key}
                    rules={CivicCenterFormConfig.physical.description.rules}
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return (
                        <RichText
                          config={{
                            ...CivicCenterFormConfig.physical.description.config,
                            name: CivicCenterFormConfig.physical.description.key,
                            error: (errors as Record<string, { message: string }>)[
                              CivicCenterFormConfig.physical.description.key
                            ]?.message,
                            value: value,
                            onChange: onChange,
                          }}
                          disabled={!hasPhysicalAccess}
                        />
                      );
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CivicCenterForm;
