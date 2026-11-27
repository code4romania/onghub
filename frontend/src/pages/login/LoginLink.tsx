import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { useAuthContext } from '../../contexts/AuthContext';
import { getTokenInfo, loginWithLink, resendToken } from '../../services/auth/OwnAuth.service';
import { authErrorMessage } from './auth-error';

/**
 * /login/link?token=… from the email. Opening the page only reads the link
 * (GET): mail scanners that prefetch links cannot use it up. The login
 * happens on the button.
 */
const LoginLink = () => {
  const { t } = useTranslation('own_login');
  const navigate = useNavigate();
  const { reloadSession } = useAuthContext();
  // Read once and removed from the address bar (history, referrers, screenshots).
  const [secret] = useState(() => new URLSearchParams(window.location.search).get('token') ?? '');
  const [info, setInfo] = useState<{ type: string; maskedEmail: string } | null>(null);
  const [state, setState] = useState<'checking' | 'ready' | 'expired' | 'resent'>('checking');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    window.history.replaceState(null, '', window.location.pathname);
    if (!secret) {
      setState('expired');
      return;
    }
    getTokenInfo(secret)
      .then((result) => {
        setInfo(result);
        setState('ready');
      })
      .catch(() => setState('expired'));
  }, [secret]);

  const login = async () => {
    setBusy(true);
    setError('');
    try {
      await loginWithLink(secret);
      await reloadSession();
      navigate('/', { replace: true });
    } catch (err) {
      setError(authErrorMessage(err, t));
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    setBusy(true);
    await resendToken(secret).catch(() => undefined);
    setBusy(false);
    setState('resent');
  };

  return (
    <div className="flex flex-col items-center bg-loginBackground bg-cover w-screen min-h-screen gap-6">
      <div className="w-full">
        <Header hideLogInButton />
      </div>
      <div className="w-full max-w-md bg-white shadow rounded-lg px-6 py-8 flex flex-col gap-4 mt-16">
        <h1 className="font-titilliumBold text-2xl">{t('link.title')}</h1>
        {state === 'checking' && <p>{t('link.checking')}</p>}
        {state === 'ready' && info && (
          <>
            <p>
              {t(info.type === 'invite' ? 'link.invite' : 'link.for', { email: info.maskedEmail })}
            </p>
            <button
              className="bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 px-6 py-3 shadow rounded-md text-black font-titilliumSemiBold"
              onClick={login}
              disabled={busy}
            >
              {t('link.continue')}
            </button>
          </>
        )}
        {state === 'expired' && (
          <>
            <p>{t('link.expired')}</p>
            {secret && (
              <button className="underline text-left" onClick={resend} disabled={busy}>
                {t('link.resend')}
              </button>
            )}
          </>
        )}
        {state === 'resent' && <p>{t('link.resent')}</p>}
        {error && (
          <p role="alert" className="text-red-600 text-sm">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginLink;
