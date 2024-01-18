import React, { ReactNode } from 'react';

interface FormReadOnlyElementProps {
  label: string;
  value?: string | number;
  helper?: ReactNode;
  onClick?: () => void;
}

const FormReadOnlyElement = ({ label, value, helper }: FormReadOnlyElementProps) => {
  return (
    <div className="relative w-full">
      <label className="block sm:text-sm lg:text-base text-xs font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative rounded-md">
        <span className="break-word">{value || '-'}</span>
      </div>
      {helper}
    </div>
  );
};

export default FormReadOnlyElement;
