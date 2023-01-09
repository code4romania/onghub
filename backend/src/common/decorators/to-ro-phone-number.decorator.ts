import { Transform } from 'class-transformer';
import { formatNumber } from 'libphonenumber-js';

export const ToRoPhoneNumber = () =>
  Transform(({ value }) => {
    // if value is not a string return value
    if (typeof value !== 'string') {
      return value;
    }

    // remove space before and after the value
    return formatNumber(value.trim().split(' ').join(''), 'RO', 'E.164');
  });
