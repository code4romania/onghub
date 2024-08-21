/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import '../multi-select/MultiSelect.css';
import { Chip } from '../chip-selection/ChipSelection';
import { ISelectData } from '../../common/helpers/format.helper';
import CreatableSelect from 'react-select/creatable';
import i18n from '../../common/config/i18n';

export interface CreatableMultiSelectProps {
  label: string;
  helperText?: string;
  error?: string;
  placeholder?: string;
  value: ISelectData[];
  readonly?: boolean;
  onChange: any;
  options: ISelectData[];
  id?: string;
  isMulti?: boolean;
  validation?: (inputValue: string) => boolean;
}

const CreatableMultiSelect = ({
  placeholder,
  onChange,
  value,
  label,
  helperText,
  error,
  readonly,
  options,
  id,
  isMulti = true,
  validation,
}: CreatableMultiSelectProps) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block sm:text-sm lg:text-base text-xs font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      {readonly && (
        <div className="py-2 flex gap-x-2 gap-y-2 flex-wrap">
          {value?.map((item, index) => (
            <Chip
              key={index}
              item={{ id: item.value, name: item.label }}
              readonly={true}
              selected={false}
              onClick={() => { }}
              id={id}
            />
          ))}
        </div>
      )}
      {error && (
        <p className="my-1 text-sm text-red-600" id={`${id}__input-error`}>
          {error}
        </p>
      )}
      {!readonly && (
        <CreatableSelect
          isMulti={isMulti}
          placeholder={placeholder}
          classNamePrefix="reactselect"
          onChange={onChange}
          value={value}
          options={options}
          isClearable
          id={id}
          formatCreateLabel={(text) => `${i18n.t('common:add_option')}: ${text}`}
          isValidNewOption={(validation ? validation : () => true)}
        />
      )}
      {!error && !readonly && helperText && (
        <p className="mt-1 text-sm text-gray-500 font-normal" id="email-description">
          {helperText}
        </p>
      )}

    </div>
  );
};

export default CreatableMultiSelect;
