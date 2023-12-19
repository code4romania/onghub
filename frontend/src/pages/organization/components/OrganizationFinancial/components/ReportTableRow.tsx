import React from 'react';
import InputField from '../../../../../components/InputField/InputField';
import { InputFieldConfig } from '../../../../../components/InputField/InputFieldConfig.interface';
import { QuestionMarkCircleIcon } from '@heroicons/react/solid';
import { Tooltip as ReactTooltip } from 'react-tooltip';

interface ReportTableRowProps {
  label: string;
  info: string;
  config: Partial<InputFieldConfig>;
  readonly?: boolean;
}

const ReportTableRow = ({ label, info, config, readonly }: ReportTableRowProps) => {
  return (
    <tr key={label}>
      <td className="whitespace-nowrap pt-5 pb-3 px-3 sm:text-lg lg:text-base text-xs font-normal text-gray-900 flex">
        {label}
        <a
          aria-label={info}
          href="#"
          className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
        >
          <span className="sr-only">{info}</span>
          <ReactTooltip
            id={`row-tooltip-${label}`}
            className="break-word"
            style={{
              whiteSpace: 'pre-wrap',
              maxWidth: '80%',
              backgroundColor: '#7D869A',
            }}
            place="top"
            variant="info"
            content={info}
          ></ReactTooltip>
          <QuestionMarkCircleIcon
            data-tooltip-id={`row-tooltip-${label}`}
            className="h-5 w-5"
            aria-hidden="true"
          />
        </a>
      </td>
      <td className="whitespace-nowrap py-4 px-3">
        <InputField config={config} readonly={readonly} />
      </td>
    </tr>
  );
};

export default ReportTableRow;
