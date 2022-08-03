import { BadRequestException } from "@nestjs/common";
import { formatNumber } from "libphonenumber-js";
import { isValidPhoneNumber } from "libphonenumber-js/max";
import { COMMON_ERRORS } from "../constants/error-common.constants";

export function validatePhone(phone: string) {
    const formattedPhone = formatNumber(
        phone.trim().split(' ').join(''),
        'RO',
        'E.164',
    );

    if (!isValidPhoneNumber(formattedPhone)) {
        throw new BadRequestException(COMMON_ERRORS.PHONE);
    }

    return formattedPhone;
}