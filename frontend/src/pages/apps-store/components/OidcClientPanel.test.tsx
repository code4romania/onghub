import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import i18n from '../../../common/config/i18n';
import API from '../../../services/API';
import OidcClientPanel from './OidcClientPanel';

jest.mock('../../../services/API', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));
const api = API as unknown as { get: jest.Mock; post: jest.Mock };

const CLIENT = {
  clientId: 'vic',
  redirectUris: ['https://vic.test/login/ngohub/callback'],
  postLogoutRedirectUris: [],
  scopes: ['openid', 'email', 'profile', 'organization'],
  firstParty: true,
  status: 'active',
};

const renderPanel = () =>
  render(
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider
        client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
      >
        <OidcClientPanel applicationId="7" />
      </QueryClientProvider>
    </I18nextProvider>,
  );

describe('OIDC client panel (O15)', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    i18n.changeLanguage('ro');
  });

  it('creates the client and shows its secret once', async () => {
    api.get
      .mockResolvedValueOnce({ data: { client: null } })
      .mockResolvedValue({ data: { client: CLIENT } });
    api.post.mockResolvedValue({ data: { clientId: 'vic', clientSecret: 's3cr3t-once' } });
    renderPanel();

    fireEvent.change(await screen.findByPlaceholderText('vic'), { target: { value: 'vic' } });
    fireEvent.change(screen.getByPlaceholderText('https://vic.example.ro/login/ngohub/callback'), {
      target: { value: 'https://vic.test/login/ngohub/callback\n' },
    });
    fireEvent.click(screen.getByLabelText('organization'));
    fireEvent.click(screen.getByRole('button', { name: 'Creează clientul' }));

    expect(await screen.findByTestId('oidc-client-secret')).toHaveTextContent('s3cr3t-once');
    expect(api.post).toHaveBeenCalledWith('/application/7/oidc-client', {
      clientId: 'vic',
      redirectUris: ['https://vic.test/login/ngohub/callback'],
      postLogoutRedirectUris: [],
      scopes: ['openid', 'email', 'profile', 'organization'],
      firstParty: true,
    });

    fireEvent.click(screen.getByRole('button', { name: 'L-am copiat' }));
    expect(screen.queryByTestId('oidc-client-secret')).toBeNull();
    expect(screen.queryByText('s3cr3t-once')).toBeNull();
    expect(await screen.findByText('vic')).toBeInTheDocument();
  });

  it('checks the client id before calling the API', async () => {
    api.get.mockResolvedValue({ data: { client: null } });
    renderPanel();
    fireEvent.change(await screen.findByPlaceholderText('vic'), { target: { value: 'V' } });
    fireEvent.click(screen.getByRole('button', { name: 'Creează clientul' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Client ID');
    expect(api.post).not.toHaveBeenCalled();
  });

  it('rotating asks for confirmation, then shows the new secret', async () => {
    api.get.mockResolvedValue({ data: { client: CLIENT } });
    api.post.mockResolvedValue({ data: { clientId: 'vic', clientSecret: 'new-secret' } });
    renderPanel();

    fireEvent.click(await screen.findByRole('button', { name: 'Generează un secret nou' }));
    expect(api.post).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Da, generează' }));

    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith('/application/7/oidc-client/rotate-secret'),
    );
    expect(await screen.findByTestId('oidc-client-secret')).toHaveTextContent('new-secret');
  });
});
