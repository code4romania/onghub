import { ChangeEventHandler } from 'react';

export interface RadioButtonConfig {
  label: string | undefined;
  name: string;
  value: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}
