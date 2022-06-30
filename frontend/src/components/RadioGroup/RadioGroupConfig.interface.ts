import { RadioButtonConfig } from '../RadioButton/RadioButtonConfig.interface';

export interface IRadioGroupConfig {
  key: string;
  label: string;
  rules: any;
  radioConfigs: RadioButtonConfig[];
}
