import { isValidPhoneNumber } from 'libphonenumber-js/max';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { formatNumber } from 'libphonenumber-js';

@ValidatorConstraint({ name: 'IsValidPhone', async: true })
export class ValidatePhoneRule implements ValidatorConstraintInterface {
  constructor() {}

  async validate(phone: string) {
    const formattedPhone = formatNumber(
      phone.trim().split(' ').join(''),
      'RO',
      'E.164',
    );

    if (!isValidPhoneNumber(formattedPhone)) {
      return false;
    } else {
      return true;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return 'Phone number is invalid';
  }
}
