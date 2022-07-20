/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Controller } from 'react-hook-form';
import { IRadioGroupConfig } from './RadioGroupConfig.interface';
import RadioButton from '../RadioButton/RadioButton';

const str2bool = (value: string) => {
  if (value && typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return value;
};

const RadioGroup = (props: {
  control: any;
  errors: any;
  readonly: boolean;
  config: IRadioGroupConfig;
}) => {
  const onChangef = (e: any) => {
    const checkBoolean = str2bool(e.target.value);
    return { ...e, taget: { value: checkBoolean } };
  };

  return (
    <div>
      <span className="flex text-normal text-gray-700 font-normal mb-2">{props.config.label}</span>
      <Controller
        name={props.config.key}
        rules={props.config.rules}
        control={props.control}
        render={({ field: { onChange, value } }) => {
          return (
            <fieldset className="flex flex-col gap-y-4 gap-x-4">
              {props.readonly && (
                <span>
                  {props.config.radioConfigs.find(
                    (item) => str2bool(item.value) === str2bool(value),
                  )?.label || ''}
                </span>
              )}
              {!props.readonly &&
                props.config.radioConfigs.map((radioConfig, index) => (
                  <RadioButton
                    config={{
                      ...radioConfig,
                      name: props.config.key,
                      onChange: (e) => onChange(onChangef(e)),
                    }}
                    checked={str2bool(radioConfig.value) === str2bool(value)}
                    key={index}
                  />
                ))}
            </fieldset>
          );
        }}
      />
      {!props.errors && (
        <p className="mt-1 text-sm text-gray-500 font-normal" id="email-description">
          {props.config.helperText}
        </p>
      )}
      {!props.readonly && props.errors && (
        <p className="mt-1 text-sm text-red-600" id="email-error">
          {props.errors.message}
        </p>
      )}
    </div>
  );
};

export default RadioGroup;
