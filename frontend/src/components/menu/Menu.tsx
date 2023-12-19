import React, { useContext, useEffect, useState } from 'react';
import { ArrowCircleLeftIcon, ArrowCircleRightIcon } from '@heroicons/react/outline';

import { useLocation, useNavigate } from 'react-router-dom';
import {
  EMPLOYEE_ROUTES,
  ADMIN_ROUTES,
  SUPER_ADMIN_ROUTES,
} from '../../common/router/Routes.constants';
import { classNames } from '../../common/helpers/tailwind.helper';
import { AuthContext } from '../../contexts/AuthContext';
import { UserRole } from '../../pages/users/enums/UserRole.enum';
import { useTranslation } from 'react-i18next';

export const getNavigationRoutes = (role: UserRole) => {
  let routes = EMPLOYEE_ROUTES;
  switch (role) {
    case UserRole.ADMIN:
      routes = ADMIN_ROUTES;
      break;
    case UserRole.SUPER_ADMIN:
      routes = SUPER_ADMIN_ROUTES;
      break;
    default:
      routes = EMPLOYEE_ROUTES;
  }

  return routes;
};

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNarrow, setIsNarrow] = useState(false);
  const { role } = useContext(AuthContext);
  const [currentMenuItemId, setCurrentMenuItemId] = useState(0 as number);
  const { t } = useTranslation('menu');

  useEffect(() => {
    if (location && role) {
      const exists = getNavigationRoutes(role).find(
        (navigationItem) => navigationItem.href.split('/')[0] == location.pathname.split('/')[1],
      );
      setCurrentMenuItemId(exists ? exists.id : -1);
    }
  }, [location.pathname]);

  const handleMenuItemClick = (item: any) => {
    setCurrentMenuItemId(item.id);
    if (item.href === location.pathname.slice(1)) {
      navigate(0);
    } else {
      navigate(`${item.href}`);
    }
  };

  return (
    <nav
      className={classNames(
        'transition-width duration-300 ease-out p-6 pt-10 space-y-4 bg-gray-900 rounded-xl font-titilliumBold cursor-pointer select-none h-fit sticky top-5 w-full',
      )}
      aria-label="Sidebar"
    >
      {role &&
        getNavigationRoutes(role).map((item) => (
          <a
            aria-label={item.name}
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
          aria-label="menu"
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
            {t('collapse')}
          </span>
        </a>
      </div>
      <div className="flex items-center justify-start text-white">v0.1.1</div>
    </nav>
  );
};

export default Menu;
