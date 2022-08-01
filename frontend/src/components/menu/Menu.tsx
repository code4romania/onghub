import React, { useEffect, useState } from 'react';
import {
  ArrowCircleLeftIcon,
  ArrowCircleRightIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline';

import { useLocation, useNavigate } from 'react-router-dom';
import { NAVIGATION_ROUTES } from '../../common/router/Routes.constants';
import { classNames } from '../../common/helpers/tailwind.helper';
import { Trans } from '@lingui/react';

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNarrow, setIsNarrow] = useState(false);
  const [currentMenuItemId, setCurrentMenuItemId] = useState(0 as number);

  useEffect(() => {
    if (location) {
      const exists = NAVIGATION_ROUTES.find(
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
    <div className="flex">
      <nav
        className={classNames(
          isNarrow ? 'w-[5.5rem]' : 'w-[16.5rem]',
          'transition-width duration-300 ease-out p-6 pt-10 space-y-4 bg-gray-900 rounded-xl font-titilliumBold cursor-pointer select-none',
        )}
        aria-label="Sidebar"
      >
        {NAVIGATION_ROUTES.map((item) => (
          <a
            key={item.name}
            className={classNames(
              item.id === currentMenuItemId ? 'bg-menu-green/[0.15] text-green' : '',
              isNarrow ? 'justify-center px-0 space-x-0' : 'px-4 space-x-5 ',
              'main-menu-item',
            )}
            onClick={() => handleMenuItemClick(item)}
          >
            <item.icon className="w-5 h-5" />
            <span
              className={classNames(
                isNarrow ? '-translate-x-2 hidden' : '',
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
            className={classNames(
              isNarrow ? 'justify-center px-0' : 'px-4 space-x-5 ',
              'main-menu-item',
            )}
          >
            <InformationCircleIcon className="w-5 h-5" />
            <span
              className={classNames(
                isNarrow ? '-translate-x-16 w-0 hidden' : '',
                'transition-all duration-50 whitespace-nowrap',
              )}
            >
              <Trans id="menu.info" />
            </span>
          </a>
          <a
            key={'menu'}
            onClick={() => setIsNarrow((res) => !res)}
            className={classNames(
              isNarrow ? 'justify-center px-0' : 'px-4 space-x-5 ',
              'main-menu-item',
            )}
          >
            {isNarrow ? (
              <ArrowCircleRightIcon className="w-5 h-5" />
            ) : (
              <ArrowCircleLeftIcon className="w-5 h-5" />
            )}
            <span
              className={classNames(
                isNarrow ? '-translate-x-16 w-0 hidden' : '',
                'transition-all duration-50 whitespace-nowrap',
              )}
            >
              <Trans id="menu.collapse" />
            </span>
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Menu;
