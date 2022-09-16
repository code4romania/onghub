import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header/Header';
import { useAuthContext } from '../../contexts/AuthContext';
import restrictedImg from './../../assets/images/Wavy_Tech-08_Single-04 modified 1.svg';

const RestrictedAccount = () => {
  const { setAuthState } = useAuthContext();

  const { t } = useTranslation('account');

  const onGoBackToSite = () => {
    setAuthState({ isAuthenticated: false, isRestricted: false });
  };

  return (
    <>
      <Header />
      <section className="min-h-full w-full h-full flex flex-col py-12 sm:p-6 lg:p-16 xl:p-20 lg:flex-row items-center justify-center">
        <div className="flex-1 flex flex-col items-start px-20 justify-center max-h-136 max-w-2xl gap-6">
          <h1 className="font-titilliumBold text-2xl  md:text-4xl ">{t('inactive')}</h1>
          <p className="font-normal text-xl md:text-2xl">
            {t('no_access')}{' '}
            <span className="text-green font-semibold">{process.env.REACT_APP_CONTACT_EMAIL}</span>
          </p>
          <div className="flex items-start flex-col sm:flex-row">
            <a className="mb-2" href={`mailto:${process.env.REACT_APP_CONTACT_EMAIL}`}>
              <button className="save-button ">{t('send_mail')}</button>
            </a>

            <button onClick={onGoBackToSite} className="edit-button mb-2 sm:ml-6">
              {t('back')}
            </button>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-20 max-h-136 max-w-2xl">
          <img src={restrictedImg} alt={t('restricted')} />
        </div>
      </section>
    </>
  );
};

export default RestrictedAccount;
