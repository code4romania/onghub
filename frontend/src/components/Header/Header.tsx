import React, { Fragment } from 'react';
import './Header.css';
import logo from './../../assets/images/logo.svg';
import { useAuthContext } from '../../contexts/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import {
  CogIcon,
  ArrowLeftEndOnRectangleIcon,
  Bars4Icon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { classNames } from '../../common/helpers/tailwind.helper';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../store/selectors';
import { useTranslation } from 'react-i18next';
import { signInWithRedirect } from 'aws-amplify/auth';
import WarningBanner from '../warning-banner/WarningBanner';
import { UserRole } from '../../pages/users/enums/UserRole.enum';
import { useOrganizationReportsStatus } from '../../services/organization/Organization.queries';

interface HeaderProps {
  openSlidingMenu?: any;
  hideLogInButton?: boolean;
}

const Header = ({ openSlidingMenu, hideLogInButton }: HeaderProps) => {
  const { logout, isAuthenticated, isRestricted } = useAuthContext();
  const navigate = useNavigate();
  const { profile } = useUser();

  const { data: reportsStatus } = useOrganizationReportsStatus(profile?.role === UserRole.ADMIN);

  const { t } = useTranslation(['header', 'dashboard']);

  return (
    <>
      <header className="bg-white">
        <nav className="sm:px-10 py-4 px-4" aria-label="Top">
          <div className="w-full flex gap-4 justify-between items-center">
            <div className="flex gap-4">
              {isAuthenticated && !isRestricted && (
                <div className="flex xl:hidden items-center">
                  <button
                    aria-label="Menu"
                    className="flex items-center gap-4 hover:bg-green-tab py-2 px-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                    onClick={() => openSlidingMenu(true)}
                  >
                    <Bars4Icon className="w-5 h-5" />
                  </button>
                </div>
              )}
              <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                <img src={logo} alt="NGO Hub" className="h-full w-full sm:max-h-12 max-h-10" />
              </div>
            </div>
            {!isAuthenticated && !isRestricted && !hideLogInButton && (
              <div className="flex gap-8 sm:gap-16 items-center">
                <a
                  className="font-titilliumBold sm:text-base text-sm"
                  href={process.env.REACT_APP_HOME_URL}
                >
                  {t('home')}
                </a>
                <button
                  aria-label={t('enter')}
                  className="bg-yellow-600 sm:text-base text-sm sm:px-6 sm:py-2 px-2 py-1 shadow rounded-full text-black font-titilliumBold"
                  onClick={(e) => signInWithRedirect()}
                >
                  {t('enter')}
                </button>
              </div>
            )}
            {isAuthenticated && !isRestricted && (
              <div className="flex space-x-4 items-center">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="flex items-center gap-4 hover:bg-green-tab sm:py-2 sm:px-4 py-1 px-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                      <span className="font-titilliumBold text-gray-900 sm:text-sm lg:text-base text-xs tracking-wide text-right">
                        {profile?.name || ''}
                      </span>
                      {/* <img className="w-10 h-10" src={profileImg} alt="Profile photo" /> */}
                      <ChevronDownIcon className="w-5 h-5 md:w-6 md:h-6 text-gray-900" />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right  absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1 divide-y divide-gray-200">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              aria-label={t('my_account')}
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'group flex items-center px-4 py-2 sm:text-sm text-xs cursor-pointer',
                              )}
                              onClick={() => navigate('/account')}
                            >
                              <CogIcon
                                className="mr-3 sm:h-5 sm:w-5 h-4 w-4 text-gray-800 "
                                aria-hidden="true"
                              />
                              {t('my_account')}
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              aria-label={t('log_out')}
                              className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'group flex items-center px-4 py-2 sm:text-sm text-xs cursor-pointer',
                              )}
                              onClick={logout}
                            >
                              <ArrowLeftEndOnRectangleIcon
                                className="mr-3 sm:h-5 sm:w-5 h-4 w-4 text-gray-800 "
                                aria-hidden="true"
                              />
                              {t('log_out')}
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            )}
          </div>
        </nav>
        {reportsStatus && reportsStatus.numberOfErroredFinancialReports > 0 && (
          <WarningBanner
            text={t('statistics.financial_reports.not_updated', { ns: 'dashboard' })}
            actionText={t('statistics.financial_reports.please_update', { ns: 'dashboard' })}
          />
        )}
        {reportsStatus && reportsStatus.numberOfErroredReportsInvestorsPartners > 0 && (
          <WarningBanner
            text={t('statistics.organization_reports.not_updated', { ns: 'dashboard' })}
            actionText={t('statistics.organization_reports.please_update', { ns: 'dashboard' })}
          />
        )}
      </header>
    </>
  );
};

export default Header;
