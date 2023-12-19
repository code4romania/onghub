import React, { useEffect, useState } from 'react';
import { Control, Controller, DeepRequired, FieldErrorsImpl, UseFormWatch } from 'react-hook-form';
import { mapCitiesToSelect, mapNameToSelect } from '../../../common/helpers/format.helper';
import InputField from '../../../components/InputField/InputField';
import ServerSelect from '../../../components/server-select/ServerSelect';
import { getCities } from '../../../services/nomenclature/Nomenclatures.service';
import { PracticeProgramFormConfig } from '../config/PracticeProgramFormConfig';
import DatePickerInput from '../../../components/date-picker-input/DatePickerInput';
import Textarea from '../../../components/Textarea/Textarea';
import ChipSelection from '../../../components/chip-selection/ChipSelection';
import { useNomenclature } from '../../../store/selectors';
import {
  useDomainsQuery,
  useFacultiesQuery,
  useSkillsQuery,
} from '../../../services/nomenclature/Nomenclature.queries';
import CreatableSelectComponent from '../../../components/creatable-multi-select/CreatableMultiSelect';
import MultiSelect from '../../../components/multi-select/MultiSelect';
import { compareAsc } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { PracticeProgramPayload } from '../../../services/practice-program/interfaces/practice-program-payload.interface';

interface PracticeProgramFormProps {
  control: Control<PracticeProgramPayload, object>;
  errors: FieldErrorsImpl<DeepRequired<PracticeProgramPayload>>;
  watch: UseFormWatch<PracticeProgramPayload>;
  onChangeFormValidity: (isValid: boolean) => void;
}

const PracticeProgramForm = ({
  control,
  errors,
  watch,
  onChangeFormValidity,
}: PracticeProgramFormProps) => {
  // store data
  const { domains, skills, faculties } = useNomenclature();

  // component state
  const [practiceProgramPeriodError, setPracticeProgramPeriodError] = useState<string>();
  const [workingHoursError, setWorkingHoursError] = useState<string>();

  // translarions
  const { t } = useTranslation(['practice_program']);

  // load nomenclature data
  useDomainsQuery();
  useSkillsQuery();
  useFacultiesQuery();

  // watchers
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const isPeriodNotDetermined = watch('isPeriodNotDetermined');
  const minWorkingHours = watch('minWorkingHours');
  const maxWorkingHours = watch('maxWorkingHours');

  useEffect(() => {
    // check if practice program end date is after start date
    if (startDate && endDate && compareAsc(startDate, endDate) === 1 && !isPeriodNotDetermined) {
      // set practice program period error on both date picker inputs
      setPracticeProgramPeriodError(t('form.end_date.start_date_after_end_date'));
    } else {
      // reset error
      setPracticeProgramPeriodError(undefined);
    }
  }, [startDate, endDate, isPeriodNotDetermined]);

  useEffect(() => {
    // check if min working hours is larger than
    if (maxWorkingHours && +minWorkingHours > +maxWorkingHours) {
      // set working hours error on both input fields
      setWorkingHoursError(t('form.max_working_hours.min_larger_than_max'));
    } else {
      // reset error
      setWorkingHoursError(undefined);
    }
  }, [maxWorkingHours, minWorkingHours]);

  useEffect(() => {
    // update additional validatity flag for period and working hours
    onChangeFormValidity(!(practiceProgramPeriodError || workingHoursError));
  }, [practiceProgramPeriodError, workingHoursError]);

  const loadOptionsCitiesSerch = async (searchWord: string) => {
    return getCities(searchWord).then((res) => res.map(mapCitiesToSelect));
  };

  return (
    <div className="p-5 sm:p-10 flex">
      <div className="flex flex-col gap-4 w-full">
        <form className="space-y-8 xxl:w-1/3 xl:w-1/2 divide-y divide-gray-200 divide-">
          <div className="flex flex-col gap-4">
            <Controller
              key={PracticeProgramFormConfig.title.key}
              name={PracticeProgramFormConfig.title.key}
              rules={PracticeProgramFormConfig.title.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <InputField
                    config={{
                      ...PracticeProgramFormConfig.title.config,
                      name: PracticeProgramFormConfig.title.key,
                      error: errors.title?.message,
                      defaultValue: value,
                      onChange: onChange,
                      id: 'practice-program-form__title',
                    }}
                  />
                );
              }}
            />
            <Controller
              key={PracticeProgramFormConfig.location.key}
              name={PracticeProgramFormConfig.location.key}
              rules={PracticeProgramFormConfig.location.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <ServerSelect
                    id="practice-program-form__cities"
                    value={value}
                    label={PracticeProgramFormConfig.location.label}
                    isClearable={false}
                    placeholder={PracticeProgramFormConfig.location.placeholder}
                    helperText={PracticeProgramFormConfig.location.helperText}
                    error={(errors as Record<string, { message: string }>)[
                      PracticeProgramFormConfig.location.key
                    ]?.message?.toString()}
                    onChange={onChange}
                    loadOptions={loadOptionsCitiesSerch}
                  />
                );
              }}
            />
            <Controller
              key={PracticeProgramFormConfig.deadline.key}
              name={PracticeProgramFormConfig.deadline.key}
              rules={PracticeProgramFormConfig.deadline.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <DatePickerInput
                    {...PracticeProgramFormConfig.deadline.config}
                    value={value}
                    onChange={onChange}
                    error={(errors as Record<string, { message: string }>)[
                      PracticeProgramFormConfig.deadline.key
                    ]?.message?.toString()}
                    id="practice-program-form__deadline__input"
                  />
                );
              }}
            />
            <Controller
              key={PracticeProgramFormConfig.description.key}
              name={PracticeProgramFormConfig.description.key}
              rules={PracticeProgramFormConfig.description.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <Textarea
                    config={{
                      ...PracticeProgramFormConfig.description.config,
                      name: PracticeProgramFormConfig.description.key,
                      error: errors.description?.message,
                      defaultValue: value,
                      onChange: onChange,
                      id: 'practice-program-form__description',
                    }}
                  />
                );
              }}
            />
            <Controller
              key={PracticeProgramFormConfig.startDate.key}
              name={PracticeProgramFormConfig.startDate.key}
              rules={PracticeProgramFormConfig.startDate.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <DatePickerInput
                    {...PracticeProgramFormConfig.startDate.config}
                    value={value}
                    onChange={onChange}
                    error={
                      (errors as Record<string, { message: string }>)[
                        PracticeProgramFormConfig.startDate.key
                      ]?.message?.toString() || practiceProgramPeriodError
                    }
                    id="practice-program-form__date-start__input"
                  />
                );
              }}
            />
            {!isPeriodNotDetermined && (
              <Controller
                key={PracticeProgramFormConfig.endDate.key}
                name={PracticeProgramFormConfig.endDate.key}
                rules={PracticeProgramFormConfig.endDate.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <DatePickerInput
                      {...PracticeProgramFormConfig.endDate.config}
                      value={value}
                      onChange={onChange}
                      error={
                        (errors as Record<string, { message: string }>)[
                          PracticeProgramFormConfig.endDate.key
                        ]?.message?.toString() || practiceProgramPeriodError
                      }
                      id="practice-program-form__date-end__input"
                    />
                  );
                }}
              />
            )}

            <Controller
              key={PracticeProgramFormConfig.isPeriodNotDetermined.key}
              name={PracticeProgramFormConfig.isPeriodNotDetermined.key}
              rules={PracticeProgramFormConfig.isPeriodNotDetermined.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <InputField
                    config={{
                      ...PracticeProgramFormConfig.isPeriodNotDetermined.config,
                      name: PracticeProgramFormConfig.isPeriodNotDetermined.key,
                      error: errors.isPeriodNotDetermined?.message,
                      defaultValue: value,
                      onChange: onChange,
                      id: 'practice-program-form__period-undetermined',
                    }}
                  />
                );
              }}
            />
            <div className="flex flex-col lg:flex-row gap-4">
              <Controller
                key={PracticeProgramFormConfig.minWorkingHours.key}
                name={PracticeProgramFormConfig.minWorkingHours.key}
                rules={PracticeProgramFormConfig.minWorkingHours.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <InputField
                      config={{
                        ...PracticeProgramFormConfig.minWorkingHours.config,
                        name: PracticeProgramFormConfig.minWorkingHours.key,
                        error: errors.minWorkingHours?.message || workingHoursError,
                        defaultValue: value,
                        onChange: onChange,
                        id: 'practice-program-form__minimum-hours',
                      }}
                    />
                  );
                }}
              />
              <Controller
                key={PracticeProgramFormConfig.maxWorkingHours.key}
                name={PracticeProgramFormConfig.maxWorkingHours.key}
                rules={PracticeProgramFormConfig.maxWorkingHours.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <InputField
                      config={{
                        ...PracticeProgramFormConfig.maxWorkingHours.config,
                        name: PracticeProgramFormConfig.maxWorkingHours.key,
                        error: errors.maxWorkingHours?.message || workingHoursError,
                        defaultValue: value,
                        onChange: onChange,
                        id: 'practice-program-form__maximum-hours',
                      }}
                    />
                  );
                }}
              />
            </div>
            <Controller
              key={PracticeProgramFormConfig.link.key}
              name={PracticeProgramFormConfig.link.key}
              rules={PracticeProgramFormConfig.link.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <InputField
                    config={{
                      ...PracticeProgramFormConfig.link.config,
                      name: PracticeProgramFormConfig.link.key,
                      error: (errors as Record<string, { message: string }>)[
                        PracticeProgramFormConfig.link.key
                      ]?.message,
                      defaultValue: value,
                      onChange: onChange,
                      id: 'practice-program-form__link',
                    }}
                  />
                );
              }}
            />
            <Controller
              key={PracticeProgramFormConfig.domains.key}
              name={PracticeProgramFormConfig.domains.key}
              rules={PracticeProgramFormConfig.domains.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <ChipSelection
                    id="practice-program-form__domains"
                    {...PracticeProgramFormConfig.domains.config}
                    values={[...domains]}
                    defaultItems={value}
                    error={(errors as Record<string, { message: string }>)[
                      PracticeProgramFormConfig.domains.key
                    ]?.message?.toString()}
                    onItemsChange={onChange}
                  ></ChipSelection>
                );
              }}
            />
            <Controller
              key={PracticeProgramFormConfig.skills.key}
              name={PracticeProgramFormConfig.skills.key}
              rules={PracticeProgramFormConfig.skills.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <CreatableSelectComponent
                    id="practice-program-form__skills"
                    value={value}
                    label={PracticeProgramFormConfig.skills.config.label}
                    helperText={PracticeProgramFormConfig.skills.config.helperText}
                    placeholder={PracticeProgramFormConfig.skills.config.placeholder}
                    error={(errors as Record<string, { message: string }>)[
                      PracticeProgramFormConfig.skills.key
                    ]?.message?.toString()}
                    onChange={onChange}
                    options={[...skills.map(mapNameToSelect)]}
                  />
                );
              }}
            />
            <Controller
              key={PracticeProgramFormConfig.faculties.key}
              name={PracticeProgramFormConfig.faculties.key}
              rules={PracticeProgramFormConfig.faculties.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <MultiSelect
                    id="practice-program-form__faculties"
                    value={value}
                    label={PracticeProgramFormConfig.faculties.config.label}
                    helperText={PracticeProgramFormConfig.faculties.config.helperText}
                    placeholder={PracticeProgramFormConfig.faculties.config.placeholder}
                    error={(errors as Record<string, { message: string }>)[
                      PracticeProgramFormConfig.faculties.key
                    ]?.message?.toString()}
                    onChange={onChange}
                    options={[...faculties.map(mapNameToSelect)]}
                  />
                );
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default PracticeProgramForm;
