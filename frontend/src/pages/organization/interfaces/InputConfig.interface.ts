import { InputFieldConfig } from '../../../components/InputField/InputFieldConfig.interface';

export interface IInputConfig {
  key: string;
  rules: any;
  config: Partial<InputFieldConfig>;
}
