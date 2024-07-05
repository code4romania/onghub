import { ExclamationCircleIcon } from '@heroicons/react/24/solid';
import React, { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label?: string;
  helper?: ReactNode;
  error?: boolean;
}

const Input = ({ label, helper, error, ...props }: InputProps) => {
  return (
    <div className="relative flex gap-1 flex-col">
      {label && (
        <label
          htmlFor={`${label}__input`}
          className="block sm:text-sm lg:text-base text-xs font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input id={`${label}__input`} {...props} />
      {helper}
      {error && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
        </div>
      )}
    </div>
  );
};

export default Input;
