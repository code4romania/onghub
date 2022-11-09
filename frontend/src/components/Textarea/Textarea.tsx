import React from 'react';
import { classNames } from '../../common/helpers/tailwind.helper';
import { TextAreaConfig } from './TextareaConfig.interface';

const Textarea = (props: {
  config: Partial<TextAreaConfig>;
  readonly?: boolean;
  disabled?: boolean;
}) => {
  return (
    <div className="relative w-full">
      {props.config.label && (
        <label
          htmlFor="email"
          className="block sm:text-sm lg:text-base text-xs font-medium text-gray-700"
        >
          {props.config.label}
        </label>
      )}

      <div className="mt-1 relative rounded-md">
        {props.readonly && <span>{props.config.defaultValue}</span>}
        {!props.readonly && (
          <textarea
            disabled={props.disabled}
            rows={4}
            name={props.config.name}
            onChange={props.config.onChange}
            className={classNames(
              props.config.error
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 '
                : 'focus:ring-indigo-500 focus:border-indigo-500',
              'block w-full pr-10 border-gray-300 shadow-sm  sm:text-base text-sm rounded-md disabled:bg-gray-100',
            )}
            placeholder={props.config.placeholder}
            defaultValue={props.config.defaultValue}
            aria-invalid={props.config.error ? 'true' : 'false'}
            id={`${props.config.id}__input`}
          ></textarea>
        )}
      </div>
      {!props.config.error && !props.readonly && (
        <p className="mt-1 sm:text-sm text-xs text-gray-500 font-normal" id="email-description">
          {props.config.helperText}
        </p>
      )}
      {props.config.error && (
        <p className="mt-1 sm:text-sm text-xs text-red-600" id={`${props.config.id}__input-error`}>
          {props.config.error}
        </p>
      )}
    </div>
  );
};

export default Textarea;
