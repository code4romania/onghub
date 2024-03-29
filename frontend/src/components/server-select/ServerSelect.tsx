/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import debounce from 'debounce-promise';
import './ServerSelect.css';
import { Chip } from '../chip-selection/ChipSelection';
import { mapCitiesToSelect } from '../../common/helpers/format.helper';

export interface ServerSelectConfig {
  label: string;
  isMulti?: boolean;
  helperText?: string;
  error?: string;
  placeholder?: string;
  isClearable?: boolean;
  value: any[];
  readonly?: boolean;
  onChange: any;
  loadOptions: any;
  id?: string;
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
  id,
}: ServerSelectConfig) => {
  const [defaultValue, setDefaultValue] = useState<any>();

  const onSearch = (inputValue: string) => (inputValue?.length >= 3 ? loadOptions(inputValue) : []);

  const debouncedLoadOptions = debounce(onSearch as any, 500, {
    leading: true,
  });

  useEffect(() => {
    setDefaultValue(value);
  }, [value]);

  return (
    <div>
      {label && (
        <label
          htmlFor={`${id}__input`}
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
              readonly={readonly}
              selected={false}
              onClick={() => {}}
              id={id}
            />
          ))}
        </div>
      )}
      {!readonly && (
        <AsyncSelect
          id={`${id}__input`}
          cacheOptions
          placeholder={placeholder}
          classNamePrefix="reactselect"
          loadOptions={debouncedLoadOptions}
          onChange={onChange}
          isClearable={isClearable}
          isMulti={isMulti}
          value={defaultValue}
        />
      )}
      {!error && !readonly && helperText && (
        <p className="mt-1 text-sm text-gray-500 font-normal" id="email-description">
          {helperText}
        </p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600" id={`${id}__input-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default ServerSelect;
