/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';
import { classNames } from '../../common/helpers/tailwind.helper';

const Select = (props: {
  config: {
    label: string;
    collection: any[];
    displayedAttribute: string;
    id?: string;
  };
  selected?: any;
  error?: string | any;
  readonly?: boolean;
  onChange: any;
  multi?: boolean;
  disabled?: boolean;
}) => {
  return (
    <div className="relative w-full">
      <Listbox disabled={props.disabled} defaultValue={props.selected} onChange={props.onChange}>
        {({ open }) => (
          <>
            <Listbox.Label className="block font-medium text-gray-700 pb-1 sm:text-sm lg:text-base text-xs">
              {props.config.label}
            </Listbox.Label>
            {props.readonly && (
              <span className="font-normal text-gray-900 sm:text-sm lg:text-base text-xs">
                {props.selected
                  ? props.config.displayedAttribute
                    ? props.selected[props.config.displayedAttribute]
                    : props.selected
                  : '-'}
              </span>
            )}
            {!props.readonly && (
              <div className=" relative">
                <Listbox.Button
                  itemID={props.config.id}
                  className="h-[44px] bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-base text-sm disabled:bg-gray-100"
                >
                  <span className="block truncate lg:text-base text-sm">
                    {(props.config.displayedAttribute && props.selected
                      ? props.selected[props.config.displayedAttribute]
                      : props.selected) || (
                      <span className="text-gray-700 font-normal sm:text-sm lg:text-base text-xs">
                        {props.config.label}
                      </span>
                    )}
                  </span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>

                <Transition
                  show={open}
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 sm:text-sm lg:text-base text-xs ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                    {props.config.collection.map((item, index) => (
                      <Listbox.Option
                        key={index}
                        className={({ active }) =>
                          classNames(
                            active ? 'text-white bg-blue-500' : 'text-gray-900',
                            'cursor-default select-none relative py-3 pl-3 pr-9',
                          )
                        }
                        value={item}
                        itemID={`${props.config.id}__select-${item.name}`}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={classNames(
                                selected ? 'font-semibold' : 'font-normal',
                                'block truncate lg:text-base text-sm',
                              )}
                            >
                              {props.config.displayedAttribute
                                ? item[props.config.displayedAttribute]
                                : item}
                            </span>

                            {selected ? (
                              <span
                                className={classNames(
                                  active ? 'text-white' : 'text-blue-600',
                                  'absolute inset-y-0 right-0 flex items-center pr-4',
                                )}
                              >
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            )}
          </>
        )}
      </Listbox>
      {props.error && (
        <p className="mt-1 text-sm text-red-600" id={`${props.config.id}__error`}>
          {props.error}
        </p>
      )}
    </div>
  );
};

export default Select;
