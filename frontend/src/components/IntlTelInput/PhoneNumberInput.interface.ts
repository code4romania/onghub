/* eslint-disable @typescript-eslint/ban-types */

import { ChangeEventHandler } from 'react';

export interface PhoneNumberInputConfig {
  label: string | undefined;
  name: string | undefined;
  placeholder?: string;
  helperText?: string;
  defaultValue?: string;
  error?: string | any;
  onChange?: any;
  onBlur?: ChangeEventHandler<HTMLInputElement>;
  addOn?: Function;
  id?: string;
}
