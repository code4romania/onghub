import { registerDecorator, ValidationOptions } from "class-validator";
import { ValidatePhoneRule } from "../helpers/validate-phone.rule";

export function IsValidPhone(validationOptions?: ValidationOptions) {
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