import React, { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { DotsVerticalIcon } from '@heroicons/react/outline';
import { classNames } from '../../common/helpers/tailwind.helper';

interface MenuItem {
  name: string;
  icon: (props: React.ComponentProps<'svg'>) => JSX.Element;
  onClick: (row: any) => void;
  type?: PopoverMenuRowType;
  htmlFor?: string;
}

interface MenuProps {
  row: any;
  menuItems: MenuItem[];
}

export enum PopoverMenuRowType {
  REMOVE = 'remove',
  SUCCESS = 'success',
  INFO = 'info',
  UPLOAD = 'upload',
  DOWNLOAD = 'download',
}

const handleStyling = (type?: PopoverMenuRowType): string => {
  switch (type) {
    case PopoverMenuRowType.SUCCESS: {
      return 'text-green-600';
    }
    case PopoverMenuRowType.REMOVE: {
      return 'text-red-600';
    }
    case PopoverMenuRowType.INFO: {
      return 'text-gray-900';
    }
    default: {
      return 'text-gray-900';
    }
  }
};

const PopoverMenu = ({ row, menuItems }: MenuProps) => {
  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={classNames(
              open ? 'text-gray-900' : 'text-gray-500',
              'group bg-white rounded-md inline-flex items-center sm:text-sm lg:text-base text-xs font-medium hover:text-gray-900 focus:outline-none',
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
            <Popover.Panel className="absolute z-10 left-1 transform -translate-x-52 mt-2 px-0 w-56 max-w-sm">
              <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="relative grid gap-4 bg-white py-4 px-5">
                  {menuItems.map((item) => (
                    <div key={item.name}>
                      {item.type === PopoverMenuRowType.DOWNLOAD && (
                        <label
                          className="-m-2.5 p-2.5 flex gap-2.5 items-start rounded-lg hover:bg-gray-50 transition ease-in-out duration-150 cursor-pointer"
                          onClick={() => {
                            item.onClick(row);
                            close();
                          }}
                        >
                          <item.icon
                            className="text-gray-900 flex-shrink-0 h-5 w-5"
                            aria-hidden="true"
                          />
                          <div className="text-gray-900 text-xm font-normal">{item.name}</div>
                        </label>
                      )}
                      {item.type === PopoverMenuRowType.UPLOAD && (
                        <label
                          htmlFor={item.htmlFor || 'upload'}
                          className="-m-2.5 p-2.5 flex gap-2.5 items-start rounded-lg hover:bg-gray-50 transition ease-in-out duration-150 cursor-pointer"
                          onClick={() => {
                            item.onClick(row);
                            close();
                          }}
                        >
                          <item.icon
                            className="text-gray-900 flex-shrink-0 h-5 w-5"
                            aria-hidden="true"
                          />
                          <div className="text-gray-900 text-xm font-normal">{item.name}</div>
                        </label>
                      )}
                      {item.type !== PopoverMenuRowType.DOWNLOAD &&
                        item.type !== PopoverMenuRowType.UPLOAD && (
                          <label
                            className="-m-2.5 p-2.5 flex gap-2.5 items-start rounded-lg hover:bg-gray-50 transition ease-in-out duration-150 cursor-pointer"
                            onClick={() => {
                              item.onClick(row);
                              close();
                            }}
                          >
                            <item.icon
                              className={classNames(
                                handleStyling(item.type),
                                'flex-shrink-0 h-5 w-5',
                              )}
                              aria-hidden="true"
                            />
                            <div
                              className={classNames(
                                handleStyling(item.type),
                                'text-xm font-normal',
                              )}
                            >
                              {item.name}
                            </div>
                          </label>
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
