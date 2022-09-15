/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Controller } from 'react-hook-form';
import { IRadioGroupConfig } from './RadioGroupConfig.interface';
import RadioButton from '../RadioButton/RadioButton';
import { str2bool } from '../../common/helpers/format.helper';

const RadioGroup = (props: {
  control: any;
  errors: any;
  readonly: boolean;
  config: IRadioGroupConfig;
  id?: string;
}) => {
  return (
    <div>
      <span className="flex text-normal text-gray-700 font-normal mb-2">{props.config.label}</span>
      <Controller
        name={props.config.key}
        rules={props.config.rules}
        control={props.control}
        render={({ field: { onChange, value } }) => {
          return (
            <fieldset id={`${props.id}__input`} className="flex flex-col gap-y-4 gap-x-4">
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
                      onChange: onChange,
                      id: `${props.id}__input`,
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
        <p className="mt-1 text-sm text-red-600" id={`${props.id}`}>
          {props.errors.message}
        </p>
      )}
    </div>
  );
};

export default RadioGroup;
