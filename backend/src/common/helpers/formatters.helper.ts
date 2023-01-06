import { formatNumber } from 'libphonenumber-js';

export const formatPhoneRo = (phone: string) => {
  return formatNumber(phone.trim().split(' ').join(''), 'RO', 'E.164');
};
