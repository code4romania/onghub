import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import ReportTableRow from './ReportTableRow';
import { Controller, useForm } from 'react-hook-form';
import { IncomeReportConfig } from './IncomeReportConfig';
import { ReportModalProps } from '../../../interfaces/ReportModalProps.interface';
import { Income } from '../../../interfaces/Income.interface';

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

  // form state
  const { control, reset, getValues } = useForm({
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
    setTotalDefalcat(newTotal);
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
                    <span className="sr-only">Close</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-xl leading-6 font-bold text-gray-900">
                      {`Raportare Cheltuieli ${year}`}
                    </Dialog.Title>
                    <div className="mt-4">
                      <p className="text-base text-gray-500">
                        Lorem ipsum. This information will be displayed publicly so be careful what
                        you share. Lorem ipsum. This information will be displayed publicly so be
                        careful what you share.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-row-reverse">
                  <span className="text-xl text-gray-900 font-bold leading-6">{`${total} RON`}</span>
                  <span className="text-xl text-gray-400 font-normal leading-6 px-3">
                    Total Venituri
                  </span>
                </div>
                <p className="mt-4 text-base leading-4 font-normal text-gray-400 text-right">
                  *suma preluata automat din raportarea ANAF
                </p>
                <form>
                  <table className="min-w-full divide-y divide-gray-300 mt-8">
                    <thead className="bg-gray-100">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left font-titilliumBold text-sm font-bold text-gray-800 sm:pl-6"
                        >
                          Categorie Venituri
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left font-titilliumBold text-sm font-bold text-gray-800"
                        >
                          Suma
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
                                  defaultValue: value,
                                  onChange: onChange,
                                  onBlur: () => recalculate(getValues() as Income),
                                }}
                                readonly={readonly}
                              />
                            );
                          }}
                        />
                      ))}
                      <tr>
                        <td className="whitespace-nowrap py-7 pl-4 pr-3 text-base font-bold text-gray-700 sm:pl-6">
                          Total Defalcat
                        </td>
                        <td className="whitespace-nowrap py-4 px-3 text-base font-bold ">
                          {`${totalDefalcat} `}
                          {totalDefalcat !== total && (
                            <span className="font-medium text-red-600">
                              {total > totalDefalcat
                                ? `(${total - totalDefalcat} RON nealocati)`
                                : `(${totalDefalcat - total} RON surplus)`}
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
                        onClick={() => {
                          onSave(getValues() as Income);
                          onClose();
                        }}
                      >
                        Salveaza
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                        onClick={() => onClose()}
                      >
                        Anuleaza Modificari
                      </button>
                    </>
                  )}
                  {isReadonly && (
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => {
                        setIsReadonly(false);
                      }}
                    >
                      Editeaza
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
