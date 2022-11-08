import { compareAsc } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Control, Controller, DeepRequired, FieldErrorsImpl, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { mapCitiesToSelect } from '../../../common/helpers/format.helper';
import ChipSelection from '../../../components/chip-selection/ChipSelection';
import DatePickerInput from '../../../components/date-picker-input/DatePickerInput';
import InputField from '../../../components/InputField/InputField';
import ServerSelect from '../../../components/server-select/ServerSelect';
import Textarea from '../../../components/Textarea/Textarea';
import { useDomainsQuery } from '../../../services/nomenclature/Nomenclature.queries';
import { getCities } from '../../../services/nomenclature/Nomenclatures.service';
import { useNomenclature } from '../../../store/nomenclature/nomenclature.selectors';
import { CivicCenterFormConfig } from '../config/CivicCenterFormConfig';
import { ageCategories } from '../constants/age-categories.constants';

interface CivicCenterFormProps {
  control: Control<any, object>;
  errors: FieldErrorsImpl<DeepRequired<any>>;
  watch: UseFormWatch<any>;
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
  const [practiceProgramPeriodError, setPracticeProgramPeriodError] = useState<string>();

  // load nomenclature data
  useDomainsQuery();

  // translarions
  const { t } = useTranslation(['civic_center_service']);

  // watchers
  const startDate = watch('startDate');
  const endDate = watch('endDate');

  useEffect(() => {
    // check if practice program end date is after start date
    if (startDate && endDate && compareAsc(startDate, endDate) === 1) {
      // set practice program period error on both date picker inputs
      setPracticeProgramPeriodError(t('form.end_date.start_date_after_end_date'));
    } else {
      // reset error
      setPracticeProgramPeriodError(undefined);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    // update additional validatity flag for period
    onChangeFormValidity(!practiceProgramPeriodError);
  }, [practiceProgramPeriodError]);

  const loadOptionsCitiesSerch = async (searchWord: string) => {
    return getCities(searchWord).then((res) => res.map(mapCitiesToSelect));
  };

  return (
    <div className="p-5 sm:p-10 flex">
      <div className="flex flex-col gap-4 w-full">
        <form className="space-y-8 xxl:w-1/3 xl:w-1/2 divide-y divide-gray-200 divide-">
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
                    error={(errors as Record<string, any>)[
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
                      (errors as Record<string, any>)[
                        CivicCenterFormConfig.startDate.key
                      ]?.message?.toString() || practiceProgramPeriodError
                    }
                  />
                );
              }}
            />
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
                      (errors as Record<string, any>)[
                        CivicCenterFormConfig.endDate.key
                      ]?.message?.toString() || practiceProgramPeriodError
                    }
                  />
                );
              }}
            />
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
                    error={(errors as Record<string, any>)[
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
                    error={(errors as Record<string, any>)[
                      CivicCenterFormConfig.ageCategories.key
                    ]?.message?.toString()}
                    onItemsChange={onChange}
                  ></ChipSelection>
                );
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CivicCenterForm;
