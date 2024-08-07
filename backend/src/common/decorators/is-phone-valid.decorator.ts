import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isValidPhoneNumber } from 'libphonenumber-js';

@ValidatorConstraint({ name: 'IsValidPhone', async: true })
class ValidatePhoneRule implements ValidatorConstraintInterface {
  constructor() {}

  async validate(phone: string) {
    return isValidPhoneNumber(phone);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Phone number is invalid';
  }
}

export function IsPhoneValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsPhoneValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ValidatePhoneRule,
    });
  };
}
