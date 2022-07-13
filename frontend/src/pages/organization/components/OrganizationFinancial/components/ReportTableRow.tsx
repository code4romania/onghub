import React from 'react';
import InputField from '../../../../../components/InputField/InputField';
import { InputFieldConfig } from '../../../../../components/InputField/InputFieldConfig.interface';
import { QuestionMarkCircleIcon } from '@heroicons/react/solid';

interface ReportTableRowProps {
  label: string;
  config: Partial<InputFieldConfig>;
  readonly?: boolean;
}

const ReportTableRow = ({ label, config, readonly }: ReportTableRowProps) => {
  return (
    <tr key={label}>
      <td className="whitespace-nowrap py-7 pl-4 pr-3 text-base font-normal text-gray-900 sm:pl-6 flex">
        {label}
        <QuestionMarkCircleIcon className="w-5 h-5 ml-2 mt-0.5 text-gray-400 cursor-pointer" />
      </td>
      <td className="whitespace-nowrap py-4 px-3">
        <InputField config={config} readonly={readonly} />
      </td>
    </tr>
  );
};

export default ReportTableRow;
