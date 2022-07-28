/* eslint-disable @typescript-eslint/no-explicit-any */
import currency from 'currency.js';
import { format } from 'date-fns';

export const formatCurrency = (value: number | string): string =>
  currency(value, { separator: ',', precision: 0, symbol: '' }).format();

export const formatDate = (value: Date | string): string => format(new Date(value), 'd/L/y');

export const URL_REGEX =
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\\.-]+)+[\w\-\\._~:/?#[\]@!\\$&'\\(\\)\\*\\+,;=.]+$/g;

export const PHONE_REGEX =
  /^(\+4|)?(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?(\s|\.|\\-)?([0-9]{3}(\s|\.|\\-|)){2}$/;
export const CUI_REGEX = /(RO)?\d+$/;
export const NAME_REGEX = /^(?!.*[ ]{2})[a-zA-Z-\săîâșțĂÎÂȘȚ]*$/;
export const ALPHANUMERIC_REGEX = /^(?!.*[ ]{2})[a-zA-Z\d-\s.#@%&()+/ăîâșțĂÎÂȘȚ"]*$/;
export const RAF_NUMBER_REGEX = /^[a-zA-Z0-9/]*$/;

export const NUMERIC_REGEX = /^\d*$/;

export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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

export const mapToId = (item: any) => item.id;
export const mapSelectToValue = (item: any) => item.value;
export const mapNameToSelect = (item: any): ISelectData => ({
  value: item.id,
  label: item.name,
});

// Cities / Counties
export const mapCitiesToSelect = (item: any): ISelectData => ({
  value: item?.id,
  // label: `${item.name}, jud. ${item.county.name}`,
  label: `${item?.name}`,
});

// Federations and Coalitions
export const mapGroupsToSelect = (item: any): ISelectData => ({
  value: item.id,
  label: item.abbreviation,
});

export const str2bool = (value: string) => {
  if (value && typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return value;
};

export const str2boolObject = (item: any) => {
  Object.keys(item).forEach((key) => {
    item[key] = str2bool(item[key]);
  });
};

export const emptyStringToNull = (obj: any): any => {
  let newObj = {};
  Object.keys(obj).forEach((key: any) => {
    newObj = { ...newObj, [key]: obj[key] || null };
  });
  return newObj;
};

// Returns an array of years.
export const rangeOfYears = (start: number, end?: number) => {
  end = end || new Date().getFullYear();
  return Array(end - start + 1)
    .fill(start)
    .map((year, index) => year + index);
};
