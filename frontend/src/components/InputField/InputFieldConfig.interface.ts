/* eslint-disable @typescript-eslint/ban-types */

import { ChangeEventHandler } from 'react';

export interface InputFieldConfig {
  type: 'text' | 'password' | 'number' | 'tel' | undefined;
  label: string | undefined;
  name: string | undefined;
  placeholder?: string;
  helperText?: string;
  defaultValue?: string;
  error?: string | any;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  addOn?: Function;
}
