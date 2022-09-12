import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Menu, { getNavigationRoutes } from './Menu';
import { InformationCircleIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/react';
import { classNames } from '../../common/helpers/tailwind.helper';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { XIcon } from '@heroicons/react/solid';

export default function Example() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useContext(AuthContext);
  const [currentMenuItemId, setCurrentMenuItemId] = useState(0 as number);

  useEffect(() => {
    if (location && role) {
      const exists = getNavigationRoutes(role).find(
        (navigationItem) => navigationItem.href == location.pathname.split('/')[1],
      );
      setCurrentMenuItemId(exists ? exists.id : -1);
    }
  }, [location.pathname]);

  const handleMenuItemClick = (item: any) => {
    setCurrentMenuItemId(item.id);
    navigate(`${item.href}`);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-4"
                enterTo="translate-x-32"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-[-18rem]"
              >
                <Dialog.Panel className="pointer-events-auto relative w-72">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 -right-8 flex pt-4">
                      <button
                        type="button"
                        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setOpen(false)}
                      >
                        <XIcon className="w-6 h-6" />
                        <span className="sr-only">Close panel</span>
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="h-full overflow-y-auto bg-gray-900">
                    <div className="space-y-6 pb-16">
                      <nav
                        className={classNames(
                          'w-full',
                          'transition-width duration-300 ease-out p-6 pt-10 space-y-4 bg-gray-900 rounded-xl font-titilliumBold cursor-pointer select-none',
                        )}
                        aria-label="Sidebar"
                      >
                        {role &&
                          getNavigationRoutes(role).map((item) => (
                            <a
                              key={item.name}
                              className={classNames(
                                item.id === currentMenuItemId
                                  ? 'bg-menu-green/[0.15] text-green'
                                  : '',
                                'px-4 space-x-5 ',
                                'main-menu-item',
                              )}
                              onClick={() => handleMenuItemClick(item)}
                            >
                              <item.icon className="w-5 h-5" />
                              <span
                                className={classNames(
                                  'transition-transform duration-50 whitespace-nowrap',
                                )}
                              >
                                {item.name}
                              </span>
                            </a>
                          ))}
                        <div className="pt-60 space-y-4">
                          <a
                            key={'info'}
                            className={classNames('px-4 space-x-5 ', 'main-menu-item')}
                          >
                            <InformationCircleIcon className="w-5 h-5" />
                            <span
                              className={classNames('transition-all duration-50 whitespace-nowrap')}
                            >
                              <Trans id="menu.info" />
                            </span>
                          </a>
                        </div>
                      </nav>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
