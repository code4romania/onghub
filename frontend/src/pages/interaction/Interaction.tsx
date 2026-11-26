import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { useAuthContext } from '../../contexts/AuthContext';
import {
  abortInteraction,
  ensureAccessToken,
  finishInteraction,
  getInteraction,
  InteractionDetails,
} from '../../services/auth/OwnAuth.service';
import { OwnLoginForm } from '../login/OwnLogin';

/**
 * /interaction/:uid: a client app (VIC) sent the user here through
 * id.ngohub.ro/oidc/auth. Without an NGO Hub session the user logs in with
 * the code (the link may open on another device); then the interaction is
 * finished on the issuer and the browser goes back to the app. Consent is
 * skipped for first-party clients.
 */
const Interaction = () => {
  const { uid = '' } = useParams();
  const { t } = useTranslation('own_login');
  const { isAuthenticated, isRestricted } = useAuthContext();
  const [details, setDetails] = useState<InteractionDetails | null>(null);
  const [state, setState] = useState<'loading' | 'login' | 'redirecting' | 'denied' | 'expired'>(
    'loading',
  );
  const [deniedRedirect, setDeniedRedirect] = useState('');
  const finishing = useRef(false);

  const client = details?.client?.name ?? '';

  const finish = async () => {
    if (finishing.current) return;
    finishing.current = true;
    try {
      const token = await ensureAccessToken();
      if (!token) {
        finishing.current = false;
        setState('login');
        return;
      }
      setState('redirecting');
      const result = await finishInteraction(uid, token);
      if (result.denied) {
        setDeniedRedirect(result.redirectTo);
        setState('denied');
        return;
      }
      window.location.assign(result.redirectTo);
    } catch (error: any) {
      // prompt=login and the session predates this request: log in again
      if (error?.response?.data?.code === 'FRESH_LOGIN_REQUIRED') {
        finishing.current = false;
        setState('login');
        return;
      }
      setState('expired');
    }
  };

  useEffect(() => {
    getInteraction(uid)
      .then((result) => {
        setDetails(result);
        // prompt=login (e.g. after a logout in the client): the existing session is not enough.
        if ((isAuthenticated || isRestricted) && !result.freshLogin) finish();
        else setState('login');
      })
      .catch(() => setState('expired'));
  }, [uid]);

  const cancel = async () => {
    try {
      const { redirectTo } = await abortInteraction(uid);
      window.location.assign(redirectTo);
    } catch {
      setState('expired');
    }
  };

  return (
    <div className="flex flex-col items-center bg-loginBackground bg-cover w-screen min-h-screen gap-6">
      <div className="w-full">
        <Header hideLogInButton />
      </div>
      <div className="flex flex-col items-center gap-4 p-4 w-full mt-8">
        {details?.client?.logo && (
          <img src={details.client.logo} alt="" className="h-16 object-contain" />
        )}
        {client && (
          <h1 className="font-titilliumBold text-2xl text-center">
            {t('interaction.title', { client })}
          </h1>
        )}
        {state === 'login' && (
          <>
            <p className="text-center max-w-md">{t('interaction.login_first', { client })}</p>
            <OwnLoginForm onLoggedIn={finish} />
            <button className="underline" onClick={cancel}>
              {t('interaction.cancel')}
            </button>
          </>
        )}
        {state === 'redirecting' && <p>{t('interaction.redirecting', { client })}</p>}
        {state === 'denied' && (
          <>
            <p role="alert" className="text-center max-w-md">
              {t('interaction.denied', { client })}
            </p>
            <button
              className="bg-yellow-600 px-6 py-3 rounded-md font-titilliumSemiBold"
              onClick={() => window.location.assign(deniedRedirect)}
            >
              {t('interaction.back', { client })}
            </button>
          </>
        )}
        {state === 'expired' && <p role="alert">{t('interaction.expired')}</p>}
      </div>
    </div>
  );
};

export default Interaction;
