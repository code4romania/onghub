import React from 'react';
import { Control, Controller, DeepRequired, FieldErrorsImpl, UseFormWatch } from 'react-hook-form';
import { mapCitiesToSelect } from '../../../common/helpers/format.helper';
import InputField from '../../../components/InputField/InputField';
import ServerSelect from '../../../components/server-select/ServerSelect';
import { getCities } from '../../../services/nomenclature/Nomenclatures.service';
import { PracticeProgramFormConfig } from '../config/PracticeProgramFormConfig';
import DatePickerInput from '../../../components/date-picker-input/DatePickerInput';
import Textarea from '../../../components/Textarea/Textarea';
import ChipSelection from '../../../components/chip-selection/ChipSelection';
import { useNomenclature } from '../../../store/selectors';
import { useDomainsQuery } from '../../../services/nomenclature/Nomenclature.queries';

interface PracticeProgramFormProps {
  control: Control<any, object>;
  errors: FieldErrorsImpl<DeepRequired<any>>;
  watch: UseFormWatch<any>;
}

const PracticeProgramForm = ({ control, errors }: PracticeProgramFormProps) => {
  const { domains } = useNomenclature();

  useDomainsQuery();

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
                    error={errors[PracticeProgramFormConfig.location.key]?.message?.toString()}
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
                    minDate={new Date()}
                    value={value}
                    onChange={onChange}
                    error={errors[PracticeProgramFormConfig.deadline.key]?.message?.toString()}
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
                    minDate={new Date()}
                    value={value}
                    onChange={onChange}
                    error={errors[PracticeProgramFormConfig.startDate.key]?.message?.toString()}
                  />
                );
              }}
            />
            <Controller
              key={PracticeProgramFormConfig.endDate.key}
              name={PracticeProgramFormConfig.endDate.key}
              rules={PracticeProgramFormConfig.endDate.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <DatePickerInput
                    {...PracticeProgramFormConfig.endDate.config}
                    minDate={new Date()}
                    value={value}
                    onChange={onChange}
                    error={errors[PracticeProgramFormConfig.endDate.key]?.message?.toString()}
                  />
                );
              }}
            />
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
                        error: errors.minWorkingHours?.message,
                        defaultValue: value,
                        onChange: onChange,
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
                        error: errors.maxWorkingHours?.message,
                        defaultValue: value,
                        onChange: onChange,
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
                      error: errors[PracticeProgramFormConfig.link.key]?.message,
                      defaultValue: value,
                      onChange: onChange,
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
                    error={errors[PracticeProgramFormConfig.domains.key]?.message?.toString()}
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

export default PracticeProgramForm;
