import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import { useAuthContext } from '../../contexts/AuthContext';
import { safeReturnTo } from '../../common/auth/return-to';
import { loginWithCode, requestLogin } from '../../services/auth/OwnAuth.service';
import { authErrorMessage } from './auth-error';

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const CODE = /^\d{6}$/;

interface OwnLoginFormProps {
  /** Called after a successful login instead of navigating (the interaction page). */
  onLoggedIn?: () => void | Promise<void>;
  returnTo?: string;
}

/**
 * Email → 6-digit code. The code only works in this browser (the request sets
 * an httpOnly cookie the verification needs), which is why the interaction
 * page uses the code rather than the link.
 */
export const OwnLoginForm = ({ onLoggedIn, returnTo }: OwnLoginFormProps) => {
  const { t } = useTranslation('own_login');
  const navigate = useNavigate();
  const { reloadSession } = useAuthContext();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const send = async (event?: React.FormEvent) => {
    event?.preventDefault();
    setError('');
    if (!EMAIL.test(email.trim())) return setError(t('invalid_email'));
    setBusy(true);
    try {
      const result = await requestLogin(email.trim());
      setMaskedEmail(result.maskedEmail);
      setStep('code');
    } catch (err) {
      setError(authErrorMessage(err, t));
    } finally {
      setBusy(false);
    }
  };

  const verify = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!CODE.test(code)) return setError(t('invalid_code'));
    setBusy(true);
    try {
      await loginWithCode(email.trim(), code);
      await reloadSession();
      if (onLoggedIn) await onLoggedIn();
      else navigate(safeReturnTo(returnTo), { replace: true });
    } catch (err) {
      setError(authErrorMessage(err, t));
    } finally {
      setBusy(false);
    }
  };

  const input =
    'block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500';
  const primary =
    'bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 px-6 py-3 shadow rounded-md text-black font-titilliumSemiBold w-full';

  return (
    <div className="w-full max-w-md bg-white shadow rounded-lg px-6 py-8 flex flex-col gap-4">
      {step === 'email' ? (
        <form onSubmit={send} className="flex flex-col gap-4" noValidate>
          <label htmlFor="own-login-email" className="font-titilliumSemiBold">
            {t('email')}
          </label>
          <input
            id="own-login-email"
            type="email"
            autoComplete="email"
            className={input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
          <button type="submit" className={primary} disabled={busy}>
            {t('send')}
          </button>
        </form>
      ) : (
        <form onSubmit={verify} className="flex flex-col gap-4" noValidate>
          <h2 className="font-titilliumBold text-xl">{t('code_title')}</h2>
          <p>{t('code_sent', { email: maskedEmail })}</p>
          <label htmlFor="own-login-code" className="font-titilliumSemiBold">
            {t('code')}
          </label>
          <input
            id="own-login-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            className={`${input} tracking-[0.5em] text-center text-2xl`}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            autoFocus
          />
          <button type="submit" className={primary} disabled={busy}>
            {t('verify')}
          </button>
          <p className="text-sm text-gray-600">{t('or_link')}</p>
          <div className="flex justify-between text-sm">
            <button type="button" className="underline" onClick={() => send()} disabled={busy}>
              {t('resend')}
            </button>
            <button
              type="button"
              className="underline"
              onClick={() => {
                setStep('email');
                setCode('');
                setError('');
              }}
            >
              {t('other_email')}
            </button>
          </div>
        </form>
      )}
      {error && (
        <p role="alert" className="text-red-600 text-sm">
          {error}
        </p>
      )}
    </div>
  );
};

/** /login (own auth). The previous presentation page lives on /start. */
const OwnLogin = () => {
  const { t } = useTranslation('own_login');
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string; search?: string } } | null)?.from;
  const returnTo =
    new URLSearchParams(location.search).get('returnTo') ??
    (from ? `${from.pathname}${from.search ?? ''}` : undefined);

  return (
    <div className="flex flex-col items-center bg-loginBackground bg-cover w-screen min-h-screen h-fit gap-6">
      <div className="w-full">
        <Header hideLogInButton />
      </div>
      <div className="flex flex-col items-center p-4 gap-6 w-full">
        <h1 className="pt-10 sm:pt-16 font-titilliumSemiBold text-3xl md:text-5xl text-center">
          {t('title')}
        </h1>
        <p className="font-titilliumSemiBold text-lg text-center max-w-xl">{t('subtitle')}</p>
        <OwnLoginForm returnTo={returnTo} />
        <Link to="/start" className="underline font-titilliumSemiBold">
          {t('register')}
        </Link>
      </div>
    </div>
  );
};

export default OwnLogin;
