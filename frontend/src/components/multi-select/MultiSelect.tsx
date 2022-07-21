/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import Select from 'react-select';
import './MultiSelect.css';
import { Chip } from '../chip-selection/ChipSelection';

export interface MultiSelectConfig {
  label: string;
  helperText?: string;
  error?: string;
  placeholder?: string;
  isClearable?: boolean;
  value: any[];
  readonly: boolean;
  onChange: any;
  options: any[];
}

const MultiSelect = ({
  placeholder,
  isClearable,
  onChange,
  value,
  label,
  helperText,
  error,
  readonly,
  options,
}: MultiSelectConfig) => {
  return (
    <div>
      {label && (
        <label htmlFor="email" className="block text-base font-medium text-gray-700">
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
              onClick={() => {}}
            />
          ))}
        </div>
      )}
      {!readonly && (
        <Select
          placeholder={placeholder}
          classNamePrefix="reactselect"
          onChange={onChange}
          isClearable={isClearable}
          isMulti={true}
          defaultValue={value}
          options={options}
        />
      )}
      {!error && helperText && (
        <p className="mt-1 text-sm text-gray-500 font-normal" id="email-description">
          {helperText}
        </p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600" id="email-error">
          {error}
        </p>
      )}
    </div>
  );
};

export default MultiSelect;
