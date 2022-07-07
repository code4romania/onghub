import { InputFieldConfig } from './InputFieldConfig.interface';

export interface IInputConfig {
  key: string;
  rules: any;
  config: Partial<InputFieldConfig>;
}
