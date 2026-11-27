export enum AuthTokenType {
  // Magic link + 6-digit code, emitted together in one email
  LOGIN = 'login',
  // First login of an invited user (or the transition email after migration)
  INVITE = 'invite',
  VERIFY_EMAIL = 'verify_email',
}

export enum AuthTokenForm {
  LINK = 'link',
  CODE = 'code',
}

/** Created now, used only if Google login is added (open question 10). */
export enum AuthProvider {
  GOOGLE = 'google',
}

export enum OidcClientStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}
