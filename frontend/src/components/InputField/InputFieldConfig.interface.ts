/* eslint-disable @typescript-eslint/ban-types */

import { ChangeEventHandler } from 'react';

export interface InputFieldConfig {
  type: 'text' | 'password' | 'number';
  label: string;
  name: string;
  placeholder?: string;
  helperText?: string;
  defaultValue?: string;
  error?: string | any;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  addOn?: Function;
}
