/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import DatePicker from 'react-datepicker';

interface DatePickerInputProps {
  label?: string;
  name?: string;
  placeholder?: string;
  helperText?: string;
  defaultValue?: string;
  minDate?: Date;
  maxDate?: Date;
  error?: string;
  onChange?: any;
  value?: Date;
  id?: string;
}

const DatePickerInput = ({
  label,
  placeholder,
  helperText,
  error,
  onChange,
  value,
  ...props
}: DatePickerInputProps) => {
  return (
    <div className="relative w-full">
      {label && (
        <label
          htmlFor={props?.id}
          className="block sm:text-sm lg:text-base text-xs font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="mt-1 relative rounded-md">
        <DatePicker
          {...props}
          className="block w-full pr-10 border-gray-300 shadow-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm lg:text-base text-xs leading-loose"
          onChange={onChange}
          dateFormat="dd.MM.yyyy"
          selected={value}
          placeholderText={placeholder}
          id={props.id}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>
      {!error && (
        <p className="mt-1 sm:text-sm text-xs text-gray-500 font-normal" id="email-description">
          {helperText}
        </p>
      )}
      {error && (
        <p className="mt-1 sm:text-sm text-xs text-red-600" id={`${props.id}__input-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default DatePickerInput;
