import React, { Fragment } from 'react';
import './Header.css';
import logo from './../../assets/images/logo.svg';
import profileImg from './../../assets/images/profile.svg';
import { useAuthContext } from '../../contexts/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import { CogIcon, LogoutIcon, MenuIcon } from '@heroicons/react/outline';
import { classNames } from '../../common/helpers/tailwind.helper';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../store/selectors';
import { Auth } from 'aws-amplify';
import { useTranslation } from 'react-i18next';

const Header = ({ openSlidingMenu }: { openSlidingMenu?: any }) => {
  const { logout, isAuthenticated, isRestricted } = useAuthContext();
  const navigate = useNavigate();
  const { profile } = useUser();

  const { t } = useTranslation('header');

  return (
    <header className="bg-white">
      <nav className="sm:px-10  py-4 px-4" aria-label="Top">
        <div className="w-full flex gap-4 justify-between items-center">
          <div className="flex gap-4">
            {isAuthenticated && (
              <div className="flex lg:hidden items-center">
                <button
                  className="flex items-center gap-4 hover:bg-green-tab py-2 px-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                  onClick={() => openSlidingMenu(true)}
                >
                  <MenuIcon className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="flex items-center">
              <img
                src={logo}
                alt="Code 4 Romania - ONG Hub"
                className="h-full w-full sm:max-h-full max-h-10"
              />
            </div>
          </div>
          {!isAuthenticated && !isRestricted && (
            <button
              className="bg-yellow-600 sm:text-base text-sm sm:px-6 sm:py-2 px-2 py-1 shadow rounded-full text-black font-titilliumBold"
              onClick={(e) => Auth.federatedSignIn()}
            >
              {t('enter')}
            </button>
          )}
          {isAuthenticated && (
            <div className="flex space-x-4 items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="flex items-center gap-4 hover:bg-green-tab sm:py-2 sm:px-4 py-1 px-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                    <span className="font-titilliumBold text-gray-900 sm:text-sm lg:text-base text-xs tracking-wide text-right">
                      {profile?.name || ''}
                    </span>
                    <img className="w-10 h-10" src={profileImg} alt="Profile photo" />
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
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'group flex items-center px-4 py-2 sm:text-sm text-xs',
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
                            className={classNames(
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                              'group flex items-center px-4 py-2 sm:text-sm text-xs',
                            )}
                            onClick={logout}
                          >
                            <LogoutIcon
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
    </header>
  );
};

export default Header;
