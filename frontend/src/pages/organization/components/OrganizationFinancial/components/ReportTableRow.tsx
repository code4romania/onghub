import React from 'react';
import InputField from '../../../../../components/InputField/InputField';
import { InputFieldConfig } from '../../../../../components/InputField/InputFieldConfig.interface';
import { QuestionMarkCircleIcon } from '@heroicons/react/solid';
import { useTranslation } from 'react-i18next';

interface ReportTableRowProps {
  label: string;
  config: Partial<InputFieldConfig>;
  readonly?: boolean;
}

const ReportTableRow = ({ label, config, readonly }: ReportTableRowProps) => {
  const { t } = useTranslation('financial');
  return (
    <tr key={label}>
      <td className="whitespace-nowrap py-7 pl-4 pr-3 text-base font-normal text-gray-900 sm:pl-6 flex">
        {label}
        <a href="#" className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500">
          <span className="sr-only">{t('report_row')}</span>
          <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" />
        </a>
      </td>
      <td className="whitespace-nowrap py-4 px-3">
        <InputField config={config} readonly={readonly} />
      </td>
    </tr>
  );
};

export default ReportTableRow;
