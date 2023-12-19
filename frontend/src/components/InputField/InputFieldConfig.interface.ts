/* eslint-disable @typescript-eslint/ban-types */

import { ChangeEventHandler } from 'react';

export interface InputFieldConfig {
  type: 'text' | 'password' | 'number' | 'tel' | 'checkbox' | undefined;
  label: string | undefined;
  name: string | undefined;
  placeholder?: string;
  helperText?: string;
  defaultValue?: string;
  error?: string | any;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onBlur?: ChangeEventHandler<HTMLInputElement>;
  addOn?: Function;
  id?: string;
}
