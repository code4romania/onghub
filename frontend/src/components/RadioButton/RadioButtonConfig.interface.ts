import { ChangeEventHandler } from 'react';

export interface RadioButtonConfig {
  type: 'radio';
  label: string | undefined;
  name: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}
