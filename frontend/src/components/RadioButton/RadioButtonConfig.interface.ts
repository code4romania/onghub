import { ChangeEventHandler } from 'react';

export interface RadioButtonConfig {
  label: string | undefined;
  name: string;
  value: any;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  id?: string;
}
