/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect, useState } from 'react';
import { classNames } from '../../common/helpers/tailwind.helper';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import debounce from 'debounce-promise';
import './ServerSelect.css';
import { Chip } from '../chip-selection/ChipSelection';

export interface ServerSelectConfig {
  label: string;
  isMulti: boolean;
  helperText?: string;
  error?: string;
  placeholder?: string;
  isClearable?: boolean;
  value: any[];
  readonly: boolean;
  onChange: any;
  loadOptions: any;
}

const ServerSelect = ({
  placeholder,
  isClearable,
  isMulti,
  onChange,
  value,
  label,
  loadOptions,
  helperText,
  error,
  readonly,
}: ServerSelectConfig) => {
  const debouncedLoadOptions = debounce(loadOptions, 500, {
    leading: false,
  });

  return (
    <div>
      {label && (
        <label htmlFor="email" className="block text-base font-medium text-gray-700">
          {label}
        </label>
      )}
      {readonly && (
        <div className="py-2 flex gap-x-2 gap-y-2 flex-wrap">
          {value?.map((item) => (
            <Chip
              key={item.value}
              item={{ id: item.value, name: item.label }}
              readonly={readonly}
              selected={false}
              onClick={() => {}}
            />
          ))}
        </div>
      )}
      {!readonly && (
        <AsyncSelect
          cacheOptions
          placeholder={placeholder}
          classNamePrefix="reactselect"
          loadOptions={debouncedLoadOptions}
          onChange={onChange}
          isClearable={isClearable}
          isMulti={isMulti}
          defaultValue={value}
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

export default ServerSelect;
