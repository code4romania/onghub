/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import InputField from '../InputField/InputField';
import { Controller } from 'react-hook-form';
import { IInputConfig } from '../InputField/InputConfig.interface';
import { classNames } from '../../common/helpers/tailwind.helper';

interface ContactFormProps {
  control: any;
  errors: any;
  readonly: boolean;
  configs: IInputConfig[];
  className?: string;
}

const ContactForm = (props: ContactFormProps) => {
  return (
    <div className={classNames('flex', props.className ? props.className : 'flex-col gap-y-4')}>
      {props.configs.map((config, index) => (
        <Controller
          key={index}
          name={config.key}
          rules={config.rules}
          control={props.control}
          render={({ field: { onChange, value } }) => {
            return (
              <InputField
                config={{
                  ...config.config,
                  name: config.key,
                  error: props.errors[config?.key]?.message,
                  defaultValue: value,
                  onChange: onChange,
                }}
                readonly={props.readonly}
              />
            );
          }}
        />
      ))}
    </div>
  );
};

export default ContactForm;
