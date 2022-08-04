import React, { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import { classNames } from '../../common/helpers/tailwind.helper';
import { Trans } from '@lingui/react';

interface MenuItem {
  name: string;
  icon: (props: React.ComponentProps<'svg'>) => JSX.Element;
  onClick: (row: any) => void;
  isRemove?: boolean;
  isUpload?: boolean;
  isDownload?: boolean;
}

interface MenuProps {
  row: any;
  menuItems: MenuItem[];
}

const PopoverMenu = ({ row, menuItems }: MenuProps) => {
  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={classNames(
              open ? 'text-gray-900' : 'text-gray-500',
              'group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none',
            )}
          >
            <DotsVerticalIcon
              className={classNames(
                open ? 'text-gray-600' : 'text-gray-400',
                'h-5 w-5 group-hover:text-gray-500',
              )}
              aria-hidden="true"
            />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 left-1 transform -translate-x-3/4 mt-2 px-0 w-56 max-w-sm">
              <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="relative grid gap-4 bg-white py-4 px-5">
                  {menuItems.map((item) => (
                    <div key={item.name}>
                      {item.isDownload && (
                        <a
                          className="-m-2.5 p-2.5 flex items-start rounded-lg hover:bg-gray-50 transition ease-in-out duration-150 cursor-pointer"
                          onClick={() => {
                            item.onClick(row);
                            close();
                          }}
                        >
                          <item.icon
                            className="text-gray-900 flex-shrink-0 h-5 w-5"
                            aria-hidden="true"
                          />
                          <div className="ml-2.5">
                            <label className="text-gray-900 text-xm font-normal">
                              <Trans id={item.name} />
                            </label>
                          </div>
                        </a>
                      )}
                      {item.isUpload && (
                        <a
                          className="-m-2.5 p-2.5 flex items-start rounded-lg hover:bg-gray-50 transition ease-in-out duration-150 cursor-pointer"
                          onClick={() => {
                            item.onClick(row);
                            close();
                          }}
                        >
                          <item.icon
                            className="text-gray-900 flex-shrink-0 h-5 w-5"
                            aria-hidden="true"
                          />
                          <div className="ml-2.5">
                            <label htmlFor="upload" className="text-gray-900 text-xm font-normal">
                              <Trans id={item.name} />
                            </label>
                          </div>
                        </a>
                      )}
                      {!item.isDownload && !item.isUpload && (
                        <a
                          className="-m-2.5 p-2.5 flex items-start rounded-lg hover:bg-gray-50 transition ease-in-out duration-150 cursor-pointer"
                          onClick={() => {
                            item.onClick(row);
                            close();
                          }}
                        >
                          <item.icon
                            className={classNames(
                              item.isRemove ? 'text-red-600' : 'text-gray-900',
                              'flex-shrink-0 h-5 w-5',
                            )}
                            aria-hidden="true"
                          />
                          <div className="ml-2.5">
                            <label
                              className={classNames(
                                item.isRemove ? 'text-red-600' : 'text-gray-900',
                                'text-xm font-normal',
                              )}
                            >
                              <Trans id={item.name} />
                            </label>
                          </div>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default PopoverMenu;
