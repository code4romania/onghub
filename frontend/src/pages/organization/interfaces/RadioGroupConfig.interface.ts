import { RadioButtonConfig } from './../../../components/RadioButton/RadioButtonConfig.interface';

export interface IRadioGroupConfig {
  key: string;
  label: string;
  rules: any;
  radioConfigs: RadioButtonConfig[];
}
