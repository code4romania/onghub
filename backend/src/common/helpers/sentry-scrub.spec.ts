import { scrubBreadcrumb, scrubEvent, scrubUrl } from './sentry-scrub';

describe('Sentry scrubbing (plan 5.6)', () => {
  it('removes OIDC codes, state and login tokens from query strings, keeps the rest', () => {
    expect(
      scrubUrl(
        'https://vic.ro/login/ngohub/callback?code=abc&state=xyz&iss=https%3A%2F%2Fid.ngohub.ro',
      ),
    ).toBe(
      'https://vic.ro/login/ngohub/callback?code=[redacted]&state=[redacted]&iss=https%3A%2F%2Fid.ngohub.ro',
    );
    expect(scrubUrl('/login/link?token=SECRET')).toBe(
      '/login/link?token=[redacted]',
    );
    expect(
      scrubUrl('/oidc/session/end?id_token_hint=eyJ.x.y&ui_locales=ro'),
    ).toBe('/oidc/session/end?id_token_hint=[redacted]&ui_locales=ro');
    expect(scrubUrl('/organization/12')).toBe('/organization/12');
  });

  it('removes the secret in /auth/token/:secret paths and any fragment', () => {
    expect(scrubUrl('/auth/token/AbC_123')).toBe('/auth/token/[redacted]');
    expect(scrubUrl('POST /auth/token/AbC_123/resend')).toBe(
      'POST /auth/token/[redacted]/resend',
    );
    expect(scrubUrl('https://app.ngohub.ro/cb#access_token=x')).toBe(
      'https://app.ngohub.ro/cb#[redacted]',
    );
  });

  it('cleans an event: URL, query, body, headers, cookies, transaction, breadcrumbs, spans', () => {
    const event = scrubEvent({
      transaction: 'GET /auth/token/SECRET',
      request: {
        url: 'https://api.ngohub.ro/auth/token/SECRET',
        query_string: 'code=c&page=2',
        data: { email: 'a@b.ro', code: '123456', name: 'Ana' },
        headers: {
          Authorization: 'Bearer x',
          Cookie: 'ngohub_refresh=y',
          accept: 'json',
        },
        cookies: { ngohub_refresh: 'y' },
      },
      breadcrumbs: [
        {
          category: 'http',
          data: { url: 'https://id.ngohub.ro/oidc/auth?state=s&client_id=vic' },
        },
      ],
      spans: [
        { description: 'GET /login/link?token=T', data: { url: '/x?code=c' } },
      ],
    });

    expect(event.transaction).toBe('GET /auth/token/[redacted]');
    expect(event.request.url).toBe(
      'https://api.ngohub.ro/auth/token/[redacted]',
    );
    expect(event.request.query_string).toBe('code=[redacted]&page=2');
    expect(event.request.data).toEqual({
      email: '[redacted]',
      code: '[redacted]',
      name: 'Ana',
    });
    expect(event.request.headers).toEqual({
      Authorization: '[redacted]',
      Cookie: '[redacted]',
      accept: 'json',
    });
    expect(event.request.cookies).toBe('[redacted]');
    expect(event.breadcrumbs[0].data.url).toBe(
      'https://id.ngohub.ro/oidc/auth?state=[redacted]&client_id=vic',
    );
    expect(event.spans[0].description).toBe('GET /login/link?token=[redacted]');
    expect(event.spans[0].data.url).toBe('/x?code=[redacted]');
  });

  it('a string body is dropped whole (form posts to /oidc/token)', () => {
    const event = scrubEvent({
      request: { data: 'grant_type=authorization_code&code=c' },
    });
    expect(event.request.data).toBe('[redacted]');
  });

  it('cleans breadcrumbs on their own', () => {
    expect(
      scrubBreadcrumb({
        message: 'GET /auth/token/S',
        data: { 'http.query': 'code=c' },
      }),
    ).toEqual({
      message: 'GET /auth/token/[redacted]',
      data: { 'http.query': '[redacted]' },
    });
  });
});
