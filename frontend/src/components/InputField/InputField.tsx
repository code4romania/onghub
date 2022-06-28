import React from 'react';
import { classNames } from '../../common/helpers/tailwind.helper';
import { ExclamationCircleIcon } from '@heroicons/react/solid';
import { InputFieldConfig } from './InputFieldConfig.interface';

const InputField = (props: { config: Partial<InputFieldConfig> }) => {
  return (
    <div className="relative">
      {props.config.label && (
        <label htmlFor="email" className="block text-base font-medium text-gray-700">
          {props.config.label}
        </label>
      )}

      <div className="mt-1 relative rounded-md">
        {props.config.addOn && props.config.addOn()}
        <input
          type={props.config.type}
          name={props.config.name}
          onChange={props.config.onChange}
          className={classNames(
            props.config.error
              ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 '
              : 'focus:ring-indigo-500 focus:border-indigo-500',
            props.config.addOn ? 'pl-14' : 'pl-4',
            'block w-full pr-10 border-gray-300 shadow-sm  sm:text-base text-sm rounded-md',
          )}
          placeholder={props.config.placeholder}
          defaultValue={props.config.defaultValue}
          aria-invalid={props.config.error ? 'true' : 'false'}
        />
        {props.config.error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>
      {!props.config.error && (
        <p className="mt-1 text-sm text-gray-500 font-normal" id="email-description">
          {props.config.helperText}
        </p>
      )}
      {props.config.error && (
        <p className="mt-1 text-sm text-red-600" id="email-error">
          {props.config.error}
        </p>
      )}
    </div>
  );
};

export default InputField;
