import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../common/config/i18n';
import { AuthContext } from '../../contexts/AuthContext';
import * as service from '../../services/auth/OwnAuth.service';
import Interaction from './Interaction';

jest.mock('../../components/Header/Header', () => () => null);
jest.mock('../../services/auth/OwnAuth.service', () => ({
  requestLogin: jest.fn(),
  loginWithCode: jest.fn(),
  loginWithLink: jest.fn(),
  getTokenInfo: jest.fn(),
  resendToken: jest.fn(),
  refreshSession: jest.fn(),
  ensureAccessToken: jest.fn(),
  logout: jest.fn(),
  getInteraction: jest.fn(),
  finishInteraction: jest.fn(),
  abortInteraction: jest.fn(),
}));
const mocked = service as jest.Mocked<typeof service>;

const assign = jest.fn();

const renderPage = (isAuthenticated: boolean) =>
  render(
    <I18nextProvider i18n={i18n}>
      <AuthContext.Provider
        value={{ isAuthenticated, isRestricted: false, reloadSession: jest.fn() } as any}
      >
        <MemoryRouter initialEntries={['/interaction/uid-1']}>
          <Routes>
            <Route path="/interaction/:uid" element={<Interaction />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    </I18nextProvider>,
  );

describe('Interaction page', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      value: { ...window.location, assign },
      writable: true,
    });
  });

  beforeEach(() => {
    jest.resetAllMocks();
    i18n.changeLanguage('ro');
    mocked.getInteraction.mockResolvedValue({
      prompt: 'login',
      client: { name: 'VIC' },
      scopes: ['openid'],
    });
  });

  it('with an NGO Hub session: finishes on the issuer and goes back to the app', async () => {
    mocked.ensureAccessToken.mockResolvedValue('tok');
    mocked.finishInteraction.mockResolvedValue({ redirectTo: 'https://id.test/oidc/auth/uid-1' });
    renderPage(true);

    await waitFor(() => expect(assign).toHaveBeenCalledWith('https://id.test/oidc/auth/uid-1'));
    expect(mocked.finishInteraction).toHaveBeenCalledWith('uid-1', 'tok');
  });

  it('without a session: asks for the code login, naming the client', async () => {
    renderPage(false);
    expect(
      await screen.findByText('Autentifică-te în NGO Hub pentru a continua în VIC.'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Adresa de e-mail')).toBeInTheDocument();
    expect(mocked.finishInteraction).not.toHaveBeenCalled();
  });

  it('denied: shows the reason and only then goes back', async () => {
    mocked.ensureAccessToken.mockResolvedValue('tok');
    mocked.finishInteraction.mockResolvedValue({
      redirectTo: 'https://vic.test/cb?error=access_denied',
      denied: 'account_inactive',
    });
    renderPage(true);
    expect(await screen.findByRole('alert')).toHaveTextContent('nu poate fi folosit pentru VIC');
    expect(assign).not.toHaveBeenCalled();
  });

  it('expired interaction', async () => {
    mocked.getInteraction.mockRejectedValue(new Error('404'));
    renderPage(true);
    expect(await screen.findByRole('alert')).toHaveTextContent('a expirat');
  });
});
