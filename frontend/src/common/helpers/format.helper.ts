/* eslint-disable @typescript-eslint/no-explicit-any */
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

// Flattens the nested objects to key_value
export const flatten = (x: any, result: any, prefix?: any) => {
  if (typeof x === 'object' && !Array.isArray(x) && x !== null) {
    Object.keys(x).forEach((key) => {
      flatten(x[key], result, prefix ? prefix + '_' + key : key);
    });
  } else {
    result[prefix] = x;
  }
  return result;
};

// export const unflatten = (data: any) => {
//   const result = {};
//   for (const i in data) {
//     const keys = i.split('_');
//     keys.reduce((r: any, e: any, j: any) => {
//       return (
//         r[e] || (r[e] = isNaN(Number(keys[j + 1])) ? (keys.length - 1 == j ? data[i] : {}) : [])
//       );
//     }, result);
//   }
//   return result;
// };

export interface ISelectData {
  value: any;
  label: string;
}

export const mapSelectToValue = (item: any) => item.value;
export const mapNameToSelect = (item: any): ISelectData => ({
  value: item.id,
  label: item.name,
});
export const mapCitiesToSelect = (item: any): ISelectData => ({
  value: item?.id,
  // label: `${item.name}, jud. ${item.county.name}`,
  label: `${item?.name}`,
});
