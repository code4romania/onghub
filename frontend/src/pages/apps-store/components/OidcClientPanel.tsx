import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OidcClientSecret,
  useCreateOidcClientMutation,
  useOidcClientQuery,
  useRotateOidcClientSecretMutation,
} from '../../../services/application/OidcClient.service';

const SCOPES = ['openid', 'email', 'profile', 'organization'];
const CLIENT_ID = /^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$/;

const lines = (value: string): string[] =>
  value
    .split(/\s+/)
    .map((line) => line.trim())
    .filter(Boolean);

// The API's message for a refused request (e.g. a redirect URI that is not https).
const apiMessage = (error: any): string | undefined => {
  const message = error?.response?.data?.message;
  return Array.isArray(message) ? message.join(', ') : message;
};

/**
 * O15: "Login with NGO Hub" for an application. The super admin creates its
 * OIDC client and rotates the secret; the secret is shown once, right after,
 * and NGO Hub never shows it again.
 */
const OidcClientPanel = ({ applicationId }: { applicationId: string }) => {
  const { t } = useTranslation('oidc_client');
  const { data: client, isLoading } = useOidcClientQuery(applicationId);
  const create = useCreateOidcClientMutation(applicationId);
  const rotate = useRotateOidcClientSecretMutation(applicationId);

  const [clientId, setClientId] = useState('');
  const [redirectUris, setRedirectUris] = useState('');
  const [postLogoutUris, setPostLogoutUris] = useState('');
  const [scopes, setScopes] = useState<string[]>(['openid', 'email', 'profile']);
  const [firstParty, setFirstParty] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [secret, setSecret] = useState<OidcClientSecret | null>(null);
  const [confirmRotate, setConfirmRotate] = useState(false);

  const onCreate = () => {
    setError(null);
    if (!CLIENT_ID.test(clientId)) return setError(t('errors.client_id'));
    if (!lines(redirectUris).length) return setError(t('errors.redirect_required'));
    create.mutate(
      {
        clientId,
        redirectUris: lines(redirectUris),
        postLogoutRedirectUris: lines(postLogoutUris),
        scopes,
        firstParty,
      },
      {
        onSuccess: setSecret,
        onError: (err) => setError(apiMessage(err) ?? t('errors.generic')),
      },
    );
  };

  const onRotate = () => {
    setError(null);
    setConfirmRotate(false);
    rotate.mutate(undefined, {
      onSuccess: setSecret,
      onError: (err) => setError(apiMessage(err) ?? t('errors.generic')),
    });
  };

  const toggleScope = (scope: string) =>
    setScopes((current) =>
      current.includes(scope) ? current.filter((s) => s !== scope) : [...current, scope],
    );

  const input =
    'block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 sm:text-sm';

  return (
    <section className="w-full bg-white shadow rounded-lg mt-4" aria-labelledby="oidc-client-title">
      <div className="py-5 lg:px-10 px-5">
        <h2
          id="oidc-client-title"
          className="font-titilliumBold sm:text-lg lg:text-xl text-md text-gray-800"
        >
          {t('title')}
        </h2>
        <p className="text-sm text-gray-500 mt-1">{t('description')}</p>
      </div>
      <div className="w-full border-t border-gray-300" />
      <div className="py-5 lg:px-10 px-5 flex flex-col gap-4">
        {secret && (
          <div
            role="alert"
            className="rounded-md bg-yellow-50 border border-yellow-300 p-4 flex flex-col gap-2"
          >
            <p className="font-titilliumBold text-gray-800">{t('secret.title')}</p>
            <p className="text-sm text-gray-700">{t('secret.once')}</p>
            <dl className="text-sm grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
              <dt className="text-gray-500">client_id</dt>
              <dd className="font-mono break-all">{secret.clientId}</dd>
              <dt className="text-gray-500">client_secret</dt>
              <dd className="font-mono break-all" data-testid="oidc-client-secret">
                {secret.clientSecret}
              </dd>
            </dl>
            <button
              type="button"
              className="edit-button self-start"
              onClick={() => setSecret(null)}
            >
              {t('secret.done')}
            </button>
          </div>
        )}

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        {isLoading ? null : client ? (
          <>
            <dl className="text-sm grid grid-cols-1 sm:grid-cols-[12rem_1fr] gap-x-4 gap-y-2">
              <dt className="text-gray-500">{t('fields.client_id')}</dt>
              <dd className="font-mono">{client.clientId}</dd>
              <dt className="text-gray-500">{t('fields.redirect_uris')}</dt>
              <dd className="font-mono break-all">{client.redirectUris.join('\n')}</dd>
              <dt className="text-gray-500">{t('fields.post_logout_uris')}</dt>
              <dd className="font-mono break-all">
                {client.postLogoutRedirectUris.join('\n') || '—'}
              </dd>
              <dt className="text-gray-500">{t('fields.scopes')}</dt>
              <dd>{client.scopes.join(' ')}</dd>
              <dt className="text-gray-500">{t('fields.first_party')}</dt>
              <dd>{client.firstParty ? t('yes') : t('no')}</dd>
              <dt className="text-gray-500">{t('fields.status')}</dt>
              <dd>{client.status}</dd>
            </dl>
            {confirmRotate ? (
              <div className="flex flex-col gap-2 rounded-md border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-gray-800">{t('rotate.warning')}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="delete-button"
                    onClick={onRotate}
                    disabled={rotate.isLoading}
                  >
                    {t('rotate.confirm')}
                  </button>
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => setConfirmRotate(false)}
                  >
                    {t('rotate.cancel')}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="edit-button self-start"
                onClick={() => setConfirmRotate(true)}
              >
                {t('rotate.button')}
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-4 max-w-2xl">
            <label className="text-sm text-gray-700 flex flex-col gap-1">
              {t('fields.client_id')}
              <input
                className={input}
                value={clientId}
                onChange={(e) => setClientId(e.target.value.trim())}
                placeholder="vic"
              />
              <span className="text-xs text-gray-500">{t('hints.client_id')}</span>
            </label>
            <label className="text-sm text-gray-700 flex flex-col gap-1">
              {t('fields.redirect_uris')}
              <textarea
                className={input}
                rows={3}
                value={redirectUris}
                onChange={(e) => setRedirectUris(e.target.value)}
                placeholder="https://vic.example.ro/login/ngohub/callback"
              />
              <span className="text-xs text-gray-500">{t('hints.uris')}</span>
            </label>
            <label className="text-sm text-gray-700 flex flex-col gap-1">
              {t('fields.post_logout_uris')}
              <textarea
                className={input}
                rows={2}
                value={postLogoutUris}
                onChange={(e) => setPostLogoutUris(e.target.value)}
              />
            </label>
            <fieldset className="text-sm text-gray-700">
              <legend>{t('fields.scopes')}</legend>
              <div className="flex flex-wrap gap-4 mt-1">
                {SCOPES.map((scope) => (
                  <label key={scope} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={scopes.includes(scope)}
                      disabled={scope === 'openid'}
                      onChange={() => toggleScope(scope)}
                    />
                    {scope}
                  </label>
                ))}
              </div>
            </fieldset>
            <label className="text-sm text-gray-700 flex items-center gap-2">
              <input
                type="checkbox"
                checked={firstParty}
                onChange={(e) => setFirstParty(e.target.checked)}
              />
              {t('fields.first_party')}
            </label>
            <button
              type="button"
              className="save-button self-start"
              onClick={onCreate}
              disabled={create.isLoading}
            >
              {t('create')}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default OidcClientPanel;
