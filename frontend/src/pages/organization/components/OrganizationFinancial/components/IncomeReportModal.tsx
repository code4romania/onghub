import React, { Fragment, useState, useEffect, useContext } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import ReportTableRow from './ReportTableRow';
import { Controller, useForm } from 'react-hook-form';
import { IncomeReportConfig } from './IncomeReportConfig';
import { ReportModalProps } from '../../../interfaces/ReportModalProps.interface';
import { Income } from '../../../interfaces/Income.interface';
import { ExternalLinkIcon } from '@heroicons/react/solid';
import { useSelectedOrganization } from '../../../../../store/selectors';
import { AuthContext } from '../../../../../contexts/AuthContext';
import { UserRole } from '../../../../users/enums/UserRole.enum';
import { formatCurrency } from '../../../../../common/helpers/format.helper';
import { useTranslation } from 'react-i18next';

const IncomeReportModal = ({
  onClose,
  readonly,
  year,
  total = 0,
  defaultValue,
  onSave,
}: ReportModalProps) => {
  const [totalDefalcat, setTotalDefalcat] = useState<number>(0);
  const [isReadonly, setIsReadonly] = useState<boolean>(readonly || false);
  const { organizationGeneral } = useSelectedOrganization();
  const { role } = useContext(AuthContext);
  const { t } = useTranslation(['financial', 'organization', 'common']);

  // form state
  const {
    control,
    reset,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  // init form values
  useEffect(() => {
    if (defaultValue) {
      reset({ ...defaultValue });
      recalculate(defaultValue as Partial<Income>);
    }
  }, [defaultValue]);

  const recalculate = (values: Partial<Income>) => {
    const newTotal = Object.values(values).reduce(
      (prev: number, current: number) => (prev += +current || 0),
      0,
    );
    setTotalDefalcat(Math.round((newTotal + Number.EPSILON) * 100) / 100);
  };

  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => onClose()}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg p-6 sm:p-10 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-3xl sm:w-full">
                <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => onClose()}
                  >
                    <span className="sr-only">{t('modal.close', { ns: 'organization' })}</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-xl leading-6 font-bold text-gray-900">
                      {`${t('modal.income_report')} ${year}`}
                    </Dialog.Title>
                    <div className="mt-4">
                      <p className="text-base text-gray-500">
                        {t('information', { ns: 'common' })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-row-reverse">
                  <span className="text-xl text-gray-900 font-bold leading-6">{`${formatCurrency(
                    total,
                  )} RON`}</span>
                  <span className="text-xl text-gray-400 font-normal leading-6 px-3">
                    {t('modal.income')}
                  </span>
                </div>
                <a
                  href={`https://webservicesp.anaf.ro/bilant?an=${year}&cui=${organizationGeneral?.cui}`}
                  target="_blank"
                  className="mt-4 text-base leading-4 font-normal text-gray-400 text-right flex flex-row-reverse"
                  rel="noreferrer"
                >
                  <ExternalLinkIcon className="w-4 h-4 ml-1 text-gray-400 cursor-pointer" />
                  {t('modal.anaf')}
                </a>
                <form className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-300 mt-8">
                    <thead className="bg-gray-100">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left font-titilliumBold text-sm font-bold text-gray-800 sm:pl-6"
                        >
                          {t('modal.category_income')}
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left font-titilliumBold text-sm font-bold text-gray-800"
                        >
                          {t('modal.sum')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {Object.getOwnPropertyNames(IncomeReportConfig).map((name) => (
                        <Controller
                          key={IncomeReportConfig[name].key}
                          name={IncomeReportConfig[name].key}
                          rules={IncomeReportConfig[name].rules}
                          control={control}
                          render={({ field: { onChange, value } }) => {
                            const { label, ...config } = IncomeReportConfig[name].config;
                            return (
                              <ReportTableRow
                                label={label}
                                config={{
                                  ...config,
                                  name: IncomeReportConfig[name].key,
                                  error: errors[IncomeReportConfig[name].key]?.message,
                                  defaultValue: value,
                                  onChange: onChange,
                                  onBlur: () => recalculate(getValues() as Income),
                                }}
                                readonly={isReadonly}
                              />
                            );
                          }}
                        />
                      ))}
                      <tr>
                        <td className="whitespace-nowrap py-7 pl-4 pr-3 text-base font-bold text-gray-700 sm:pl-6">
                          {t('modal.defalcat')}
                        </td>
                        <td className="whitespace-nowrap py-4 px-3 text-base font-bold ">
                          {`${totalDefalcat} `}
                          {totalDefalcat !== total && (
                            <span className="font-medium text-red-600">
                              {total > totalDefalcat
                                ? `(${formatCurrency(total - totalDefalcat)} RON ${t(
                                    'modal.unallocated',
                                  )})`
                                : `(${formatCurrency(totalDefalcat - total)} RON ${t(
                                    'modal.excess',
                                  )})`}
                            </span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </form>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  {!isReadonly && (
                    <>
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={handleSubmit(onSave)}
                      >
                        {t('modal.save', { ns: 'organization' })}
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={() => onClose()}
                      >
                        {t('modal.cancel', { ns: 'organization' })}
                      </button>
                    </>
                  )}
                  {isReadonly && role !== UserRole.EMPLOYEE && (
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => {
                        setIsReadonly(false);
                      }}
                    >
                      {t('edit', { ns: 'common' })}
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default IncomeReportModal;
