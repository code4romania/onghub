import { TFunction } from 'i18next';

const KNOWN = ['AUTH_004', 'AUTH_005', 'AUTH_006', 'AUTH_010'];

/** Maps the backend's `code` (AUTH_00x) to a message; anything else is generic. */
export const authErrorMessage = (error: unknown, t: TFunction): string => {
  const code = (error as { response?: { data?: { code?: string } } })?.response?.data?.code;
  return code && KNOWN.includes(code) ? t(`errors.${code}`) : t('errors.generic');
};
