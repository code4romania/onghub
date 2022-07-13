import React, { useEffect, useState } from 'react';
import { classNames } from '../../common/helpers/tailwind.helper';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import debounce from 'debounce-promise';
import './Search.css';
import { getCities } from '../../services/Nomenclatures.service';

export interface ServerSelectConfig {
  placeholder: string;
  isClearable: boolean;
  isMulti: boolean;
  onChange: any;
  defaultInputValue: string;
}

const ServerSelect = ({
  placeholder,
  isClearable,
  isMulti,
  onChange,
  defaultInputValue,
}: ServerSelectConfig) => {
  const loadOptions = async (searchWord: string) => {
    console.log(searchWord);
    return getCities(28, searchWord).then((res) =>
      res.map((item: any) => ({ value: item.id, label: `${item.name}, jud. ${item.county.name}` })),
    );
  };

  const debouncedLoadOptions = debounce(loadOptions, 500, {
    leading: false,
  });

  return (
    <AsyncSelect
      cacheOptions
      placeholder={placeholder}
      classNamePrefix="reactselect"
      loadOptions={debouncedLoadOptions}
      onChange={onChange}
      isClearable={isClearable}
      isMulti={isMulti}
      defaultValue={defaultInputValue}
    />
  );
};

export default ServerSelect;
