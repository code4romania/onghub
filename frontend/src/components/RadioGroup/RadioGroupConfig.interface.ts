import { RadioButtonConfig } from '../RadioButton/RadioButtonConfig.interface';

export interface IRadioGroupConfig {
  key: string;
  label: string;
  rules: any;
  helperText?: string;
  radioConfigs: RadioButtonConfig[];
}
