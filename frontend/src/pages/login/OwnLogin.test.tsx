import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../common/config/i18n';
import { AuthContext } from '../../contexts/AuthContext';
import * as service from '../../services/auth/OwnAuth.service';
import { OwnLoginForm } from './OwnLogin';

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

const renderForm = (props = {}, reloadSession = jest.fn().mockResolvedValue(undefined)) =>
  render(
    <I18nextProvider i18n={i18n}>
      <AuthContext.Provider value={{ reloadSession } as any}>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<OwnLoginForm {...props} />} />
            <Route path="/organization" element={<p>organization page</p>} />
            <Route path="/" element={<p>home page</p>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    </I18nextProvider>,
  );

describe('OwnLoginForm', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    i18n.changeLanguage('ro');
  });

  it('email → code → session, then goes to the (safe) returnTo', async () => {
    mocked.requestLogin.mockResolvedValue({ maskedEmail: 'a•••@ong.ro' });
    mocked.loginWithCode.mockResolvedValue('token');
    const reloadSession = jest.fn().mockResolvedValue(undefined);
    renderForm({ returnTo: '/organization' }, reloadSession);

    await userEvent.type(screen.getByLabelText('Adresa de e-mail'), 'ana@ong.ro');
    await userEvent.click(screen.getByRole('button', { name: 'Trimite codul' }));
    expect(mocked.requestLogin).toHaveBeenCalledWith('ana@ong.ro', undefined);
    expect(await screen.findByText(/a•••@ong\.ro/)).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText('Codul din e-mail'), '12a3456');
    await userEvent.click(screen.getByRole('button', { name: 'Autentifică-te' }));

    expect(mocked.loginWithCode).toHaveBeenCalledWith('ana@ong.ro', '123456');
    await waitFor(() => expect(reloadSession).toHaveBeenCalled());
    expect(await screen.findByText('organization page')).toBeInTheDocument();
  });

  it('never follows an external returnTo', async () => {
    mocked.requestLogin.mockResolvedValue({ maskedEmail: 'a•••@ong.ro' });
    mocked.loginWithCode.mockResolvedValue('token');
    renderForm({ returnTo: 'https://evil.test' });

    await userEvent.type(screen.getByLabelText('Adresa de e-mail'), 'ana@ong.ro');
    await userEvent.click(screen.getByRole('button', { name: 'Trimite codul' }));
    await userEvent.type(await screen.findByLabelText('Codul din e-mail'), '123456');
    await userEvent.click(screen.getByRole('button', { name: 'Autentifică-te' }));
    expect(await screen.findByText('home page')).toBeInTheDocument();
  });

  it('shows the backend reason for a bad code and stays on the form', async () => {
    mocked.requestLogin.mockResolvedValue({ maskedEmail: 'a•••@ong.ro' });
    mocked.loginWithCode.mockRejectedValue({ response: { data: { code: 'AUTH_006' } } });
    renderForm();

    await userEvent.type(screen.getByLabelText('Adresa de e-mail'), 'ana@ong.ro');
    await userEvent.click(screen.getByRole('button', { name: 'Trimite codul' }));
    await userEvent.type(await screen.findByLabelText('Codul din e-mail'), '000000');
    await userEvent.click(screen.getByRole('button', { name: 'Autentifică-te' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Prea multe încercări greșite');
  });

  it('validates the email locally', async () => {
    renderForm();
    await userEvent.type(screen.getByLabelText('Adresa de e-mail'), 'not-an-email');
    await userEvent.click(screen.getByRole('button', { name: 'Trimite codul' }));
    expect(screen.getByRole('alert')).toHaveTextContent('adresă de e-mail validă');
    expect(mocked.requestLogin).not.toHaveBeenCalled();
  });

  it('the embedded form (interaction page) calls onLoggedIn instead of navigating', async () => {
    mocked.requestLogin.mockResolvedValue({ maskedEmail: 'a•••@ong.ro' });
    mocked.loginWithCode.mockResolvedValue('token');
    const onLoggedIn = jest.fn();
    renderForm({ onLoggedIn });

    await userEvent.type(screen.getByLabelText('Adresa de e-mail'), 'ana@ong.ro');
    await userEvent.click(screen.getByRole('button', { name: 'Trimite codul' }));
    await userEvent.type(await screen.findByLabelText('Codul din e-mail'), '123456');
    await userEvent.click(screen.getByRole('button', { name: 'Autentifică-te' }));
    await waitFor(() => expect(onLoggedIn).toHaveBeenCalled());
  });
});
