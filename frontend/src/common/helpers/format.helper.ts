import currency from 'currency.js';
import { format } from 'date-fns';

export const formatCurrency = (value: number | string): string =>
  currency(value, { separator: ',', precision: 0, symbol: '' }).format();

export const formatDate = (value: Date | string): string => format(new Date(value), 'd/L/y');

export const URL_REGEX =
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\\.-]+)+[\w\-\\._~:/?#[\]@!\\$&'\\(\\)\\*\\+,;=.]+$/g;

export const PHONE_REGEX = /0\d{9}/;
export const CUI_REGEX = /((RO)?\d+)/;
export const NAME_REGEX = /^[a-zA-Z-\s]*$/;
export const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9-\s]*$/;
export const DESCRIPTION_REGEX = /^(.|\s)*[a-zA-Z]+(.|\s)*$/;
export const RAF_NUMBER_REGEX = /^[a-zA-Z0-9/]*$/;

export const NUMERIC_REGEX = /^[0-9]*$/;
