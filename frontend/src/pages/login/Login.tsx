import React, { useEffect } from 'react';
import { Hub } from 'aws-amplify/utils';
import Header from '../../components/Header/Header';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  CREATE_LOCAL_STORAGE_ACTIVE_STEP_KEY,
  CREATE_LOCAL_STORAGE_KEY,
  ORGANIZATION_AGREEMENT_KEY,
} from '../create-organziation/constants/CreateOrganization.constant';

const Login = () => {
  const { t } = useTranslation(['login']);
  const navigate = useNavigate();

  useEffect(() => {
    const listener: any = Hub.listen('auth', ({ payload }: any) => {
      const { event, data } = payload;
      switch (event) {
        case 'signInWithRedirect':
        case 'signedIn':
          console.log('Authenticated...', data);
          break;
        case 'signInWithRedirect_failure':
        case 'signedIn_failure':
          console.log('Error', data);
          break;
        case 'signUp':
          console.log('user signed up');
          break;
        case 'signOut':
          console.log('user signed out');
          break;
        case 'tokenRefresh':
          console.log('token refresh succeeded');
          break;
        case 'tokenRefresh_failure':
          console.log('token refresh failed');
          break;
        case 'configured':
          console.log('the Auth module is configured');
          break;
      }
      // unsubscribe
      return listener;
    });
  }, []);

  const onLogin = () => {
    // make sure you are not stuck in case something happens on create organization
    localStorage.removeItem(CREATE_LOCAL_STORAGE_KEY);
    localStorage.removeItem(CREATE_LOCAL_STORAGE_ACTIVE_STEP_KEY);
    localStorage.removeItem(ORGANIZATION_AGREEMENT_KEY);
    navigate('/new/account');
  };

  return (
    <>
      <div className="flex flex-col items-center bg-loginBackground bg-cover w-screen min-h-screen h-fit gap-6">
        <div className="w-full">
          <Header />
        </div>
        <div className="flex flex-col items-center p-4 gap-6">
          <div className="pt-10 sm:pt-24 font-titilliumSemiBold text-3xl md:text-5xl text-center">
            {t('title')}
          </div>
          <div className="font-titilliumSemiBold text-lg md:text-xl max-w-3xl text-center pb-10 sm:pb-14">
            {t('description')}
          </div>
          <div className="w-full max-w-4xl bg-white shadow rounded-lg px-4 sm:px-10 py-4 sm:py-[58px] flex sm:grid gap-6 sm:gap-12 sm:grid-cols-2 flex-col-reverse items-center">
            <div className="flex flex-col gap-5">
              <div className="font-titilliumBold text-2xl md:text-[2rem]">{t('about.title')}</div>
              <div className="font-titillium">{t('about.description')}</div>

              <button
                aria-label={t('about.start_form')}
                className="bg-yellow-600 hover:bg-yellow-700 sm:text-base px-6 py-3 text-sm shadow rounded-md text-black font-titilliumSemiBold w-fit"
                onClick={onLogin}
              >
                {t('about.start_form')}
              </button>
            </div>
            <div className="bg-clock bg-no-repeat bg-contain w-full h-40 sm:h-60 bg-center"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
