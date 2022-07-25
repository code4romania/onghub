import React from 'react';
import { RadioButtonConfig } from './RadioButtonConfig.interface';

const RadioButton = (props: { config: RadioButtonConfig; checked: boolean }) => {
  return (
    <div key={props.config.name} className="flex items-center">
      <input
        type="radio"
        id={props.config.name + props.config.value}
        name={props.config.name}
        value={props.config.value}
        checked={props.checked}
        onChange={props.config.onChange}
        className="focus:ring-green h-4 w-4 text-green border-gray-300"
      />
      <label
        htmlFor={props.config.name + props.config.value}
        className="ml-2 block text-normal font-medium text-gray-800"
      >
        {props.config.label}
      </label>
    </div>
  );
};

export default RadioButton;
