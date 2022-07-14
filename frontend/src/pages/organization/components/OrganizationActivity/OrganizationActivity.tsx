import { PencilIcon } from '@heroicons/react/solid';
import React, { useEffect, useState } from 'react';
import { classNames } from '../../../../common/helpers/tailwind.helper';
import ChipSelection from '../../../../components/chip-selection/ChipSelection';
import { OrganizationActivityConfig, ORGANIZATION_AREA_ENUM } from './OrganizationActivityConfig';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { OrganizationGeneralConfig } from '../OrganizationGeneral/OrganizationGeneralConfig';
import RadioGroup from '../../../../components/RadioGroup/RadioGroup';
import Search from '../../../../components/server-select/ServerSelect';
import ServerSelect from '../../../../components/server-select/ServerSelect';
import { getCities } from '../../../../services/Nomenclatures.service';
import Select from '../../../../components/Select/Select';

const OrganizationActivity = () => {
  const [readonly, setReadonly] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const area = watch('area');

  const handleSave = (data: any) => {
    console.log(area);
    // console.log(data);
  };

  const startEdit = () => {
    setReadonly(false);
  };

  const citiesSearchMap = (item: any) => ({
    value: item.id,
    label: `${item.name}, jud. ${item.county.name}`,
  });

  const regions = (item: any) => ({
    value: item.id,
    label: `${item.name}`,
  });

  const loadOptionsRegionsSerch = async (searchWord: string) => {
    return getCities(searchWord, 28).then((res) => res.map(citiesSearchMap));
  };

  const loadOptionsCitiesSerch = async (searchWord: string) => {
    return getCities(searchWord, 28).then((res) => res.map(citiesSearchMap));
  };

  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="p-5 sm:p-10 flex justify-between">
        <span className="font-titilliumBold text-xl text-gray-800">Date generale</span>

        <button
          type="button"
          className={classNames(readonly ? 'edit-button' : 'save-button')}
          onClick={readonly ? startEdit : handleSave}
        >
          <PencilIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          {readonly ? 'Editeaza' : 'Salveaza modificari'}
        </button>
      </div>

      <div className="w-full border-t border-gray-300" />
      <div className="p-5 sm:p-10 flex flex-col gap-4 divide-y divide-gray-200">
        <div className="flex flex-col gap-4 ">
          <div>
            <span className="text-xl font-bold text-gray-900">Domenii si acoperire geografica</span>
            <p className="mt-1 mb-4 text-sm text-gray-500 font-normal" id="email-description">
              This information will be displayed publicly so be careful what you share.
            </p>
          </div>
          <Controller
            key={OrganizationActivityConfig.domains.key}
            name={OrganizationActivityConfig.domains.key}
            rules={OrganizationActivityConfig.domains.rules}
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <ChipSelection
                  {...OrganizationActivityConfig.domains.config}
                  defaultItems={value}
                  error={errors[OrganizationActivityConfig.domains.key]?.message as string}
                  onItemsChange={onChange}
                ></ChipSelection>
              );
            }}
          />
          <RadioGroup
            control={control}
            readonly={readonly}
            errors={errors[OrganizationActivityConfig.area.key]}
            config={OrganizationActivityConfig.area}
          />
          {area == 1 && (
            <Controller
              key={OrganizationGeneralConfig.name.key}
              name={OrganizationGeneralConfig.name.key}
              rules={OrganizationGeneralConfig.name.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <ServerSelect
                    value={value}
                    label="Mentioneaza federatii*"
                    isMulti={true}
                    isClearable={false}
                    placeholder={''}
                    helperText={'Lorem ipsum. Alege din listă sau adaugă valoare.'}
                    error={errors[OrganizationGeneralConfig.name.key]?.message as string}
                    onChange={onChange}
                    loadOptions={loadOptionsCitiesSerch}
                    readonly={readonly}
                  />
                );
              }}
            />
          )}
          {area == 2 && (
            <Controller
              key={OrganizationGeneralConfig.yearCreated.key}
              name={OrganizationGeneralConfig.yearCreated.key}
              rules={OrganizationGeneralConfig.yearCreated.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <Select
                    config={{
                      ...OrganizationGeneralConfig.yearCreated.config,
                    }}
                    selected={value}
                    onChange={onChange}
                    readonly={readonly}
                  />
                );
              }}
            />
          )}
        </div>
        <div className="flex flex-col gap-4 pt-4">
          <div>
            <span className="text-xl font-bold text-gray-900">Federatii si coalitii</span>
            <p className="mt-1 mb-4 text-sm text-gray-500 font-normal" id="email-description">
              This information will be displayed publicly so be careful what you share.
            </p>
          </div>
          <RadioGroup
            control={control}
            readonly={readonly}
            errors={errors[OrganizationActivityConfig.isPartOfFederation.key]}
            config={OrganizationActivityConfig.isPartOfFederation}
          />
          <RadioGroup
            control={control}
            readonly={readonly}
            errors={errors[OrganizationActivityConfig.isPartOfInternationalOrganization.key]}
            config={OrganizationActivityConfig.isPartOfInternationalOrganization}
          />
        </div>
        <div className="flex flex-col gap-4 pt-4">
          <div>
            <span className="text-xl font-bold text-gray-900">Filiale si sucursale</span>
            <p className="mt-1 mb-4 text-sm text-gray-500 font-normal" id="email-description">
              This information will be displayed publicly so be careful what you share.
            </p>
          </div>
          <RadioGroup
            control={control}
            readonly={readonly}
            errors={errors[OrganizationActivityConfig.hasBranches.key]}
            config={OrganizationActivityConfig.hasBranches}
          />
        </div>
        <div className="flex flex-col gap-4 pt-4">
          <div>
            <span className="text-xl font-bold text-gray-900">Alte informatii</span>
            <p className="mt-1 mb-4 text-sm text-gray-500 font-normal" id="email-description">
              This information will be displayed publicly so be careful what you share.
            </p>
          </div>
          <RadioGroup
            control={control}
            readonly={readonly}
            errors={errors[OrganizationActivityConfig.isSocialServiceViable.key]}
            config={OrganizationActivityConfig.isSocialServiceViable}
          />
          <RadioGroup
            control={control}
            readonly={readonly}
            errors={errors[OrganizationActivityConfig.offersGrants.key]}
            config={OrganizationActivityConfig.offersGrants}
          />
          <RadioGroup
            control={control}
            readonly={readonly}
            errors={errors[OrganizationActivityConfig.isPublicIntrestOrganization.key]}
            config={OrganizationActivityConfig.isPublicIntrestOrganization}
          />
        </div>
      </div>
    </div>
  );
};

export default OrganizationActivity;
