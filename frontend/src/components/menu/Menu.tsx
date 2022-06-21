import React, { useState } from 'react';
import {
  ArrowCircleLeftIcon,
  ArrowCircleRightIcon,
  CollectionIcon,
  InformationCircleIcon,
  SunIcon,
  TemplateIcon,
  ViewGridAddIcon,
} from '@heroicons/react/outline';

import { UserGroupIcon } from '@heroicons/react/solid';

/* This example requires Tailwind CSS v2.0+ */
const navigation = [
  { name: 'Dashboard', href: '#', current: true, icon: TemplateIcon },
  { name: 'Organizatia mea', href: '#', current: false, icon: SunIcon },
  { name: 'Utilizatori', href: '#', current: false, icon: UserGroupIcon },
  { name: 'Aplicatiile mele', href: '#', current: false, icon: ViewGridAddIcon },
  { name: 'Toate aplicatiile', href: '#', current: false, icon: CollectionIcon },
];

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

const Menu = () => {
  const [isNarrow, setIsNarrow] = useState(false);

  return (
    <div className="flex">
      <nav
        className={classNames(
          isNarrow ? 'w-[5.5rem]' : 'w-[16.5rem]',
          'transition-all ease-out space-y-1 p-6 pt-10 space-y-4 bg-gray-900 rounded-xl font-titillium',
        )}
        aria-label="Sidebar"
      >
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={classNames(
              item.current
                ? 'bg-menu-green/[0.15] text-green'
                : 'text-gray-50 hover:bg-menu-green/[0.15] hover:text-green',
              isNarrow ? 'justify-center px-0 space-x-0' : 'px-4 space-x-5 py-2',
              'flex items-center px-0  font-medium rounded-md ',
            )}
            aria-current={item.current ? 'page' : undefined}
          >
            <item.icon className="w-5 h-5" />
            <span className={classNames(isNarrow ? 'invisible w-0' : '')}>{item.name}</span>
          </a>
        ))}
        <div className="pt-60 space-y-4">
          <a
            key={'info'}
            href={'#'}
            className={classNames(
              isNarrow ? 'justify-center px-0' : 'px-4 space-x-5  py-2',
              'text-gray-50 hover:bg-menu-green/[0.15] hover:text-green flex items-center px-0 font-medium rounded-md ',
            )}
          >
            <InformationCircleIcon className="w-5 h-5" />
            <span className={classNames(isNarrow ? 'invisible w-0' : 'block')}>{'Informatii'}</span>
          </a>
          <a
            key={'menu'}
            onClick={() => setIsNarrow((res) => !res)}
            className={classNames(
              isNarrow ? 'justify-center px-0' : 'px-4 space-x-5 py-2',
              'text-gray-50 hover:bg-menu-green/[0.15] hover:text-green flex items-center px-0  font-medium rounded-md',
            )}
          >
            {isNarrow ? (
              <ArrowCircleRightIcon className="w-5 h-5" />
            ) : (
              <ArrowCircleLeftIcon className="w-5 h-5" />
            )}
            <span
              className={classNames(
                isNarrow ? 'invisible w-0' : '',
                'transition-width duration-150',
              )}
            >
              {'Restrange meniu'}
            </span>
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Menu;
