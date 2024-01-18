import React from 'react';
import Input, { InputProps } from '../input/Input';
import FormReadOnlyElement from '../form-readonly-element/FormReadonlyElement';
import { classNames } from '../../common/helpers/tailwind.helper';

interface FormInputProps extends InputProps {
  errorMessage?: string;
}

const FormInput = ({
  errorMessage,
  readOnly,
  value,
  label,
  className,
  helper,
  ...props
}: FormInputProps) => {
  return readOnly ? (
    <FormReadOnlyElement
      label={label || ''}
      value={value instanceof Array ? value.join(', ') : value}
      helper={helper}
    />
  ) : (
    <>
      <Input
        value={value}
        label={label}
        className={classNames(
          className,
          errorMessage
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 pr-10'
            : 'focus:ring-indigo-500 focus:border-indigo-500',
          props.type === 'checkbox'
            ? ''
            : 'block w-full border-gray-300 shadow-sm sm:text-base text-sm rounded-md disabled:bg-gray-100 min-w-[6.5rem]',
          props.type === 'password' ? 'pr-10' : '',
        )}
        aria-invalid={errorMessage ? 'true' : 'false'}
        {...props}
        helper={
          errorMessage ? (
            <p
              className="mt-1 sm:text-sm text-xs text-red-600 whitespace-pre-wrap"
              id={`${props.id}__input-error`}
            >
              {errorMessage}
            </p>
          ) : (
            helper
          )
        }
        error={!!errorMessage}
      />
    </>
  );
};

export default FormInput;
