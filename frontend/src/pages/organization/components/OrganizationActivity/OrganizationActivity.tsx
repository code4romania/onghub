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
import Select from '../../../../components/Select/Select';
import { getCities } from '../../../../services/nomenclature/Nomenclatures.service';
import { useNomenclature, useSelectedOrganization } from '../../../../store/selectors';
import {
  useCoalitionsQuery,
  useDomainsQuery,
  useFederationsQuery,
  useRegionsQuery,
} from '../../../../services/nomenclature/Nomenclature.queries';
import InputField from '../../../../components/InputField/InputField';
import { useOrganizationMutation } from '../../../../services/organization/Organization.queries';

const OrganizationActivity = () => {
  const { organizationActivity } = useSelectedOrganization();
  const { domains, regions, federations, coalitions } = useNomenclature();
  const { mutate } = useOrganizationMutation();

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

  //queries

  useDomainsQuery();
  useRegionsQuery();
  useFederationsQuery();
  useCoalitionsQuery();

  const area = watch('area');
  const isPartOfFederation = watch('isPartOfFederation');
  const isPartOfCoalition = watch('isPartOfCoalition');
  const isPartOfInternationalOrganization = watch('isPartOfInternationalOrganization');
  const hasBranches = watch('hasBranches');

  const handleSave = (data: any) => {
    setReadonly(true);

    const organizationActivity = {
      ...data,
      branches: [...data.branches.map((item: any) => item.value)],
      cities: [...data.cities.map((item: any) => item.value)],
      coalitions: [data.coalitions.id],
      federations: [data.federations.id],
    };

    mutate({ id: 3, organization: { general: organizationActivity } });
  };
  const startEdit = () => {
    setReadonly(false);
  };

  const citiesSearchMap = (item: any) => ({
    value: item.id,
    label: `${item.name}, jud. ${item.county.name}`,
  });

  const regionsMap = (item: any) => ({
    value: item.id,
    label: `${item.name}`,
  });

  const loadOptionsRegionsSerch = async (searchWord: string) => {
    return getCities(searchWord, 28).then((res: any[]) => res.map(citiesSearchMap));
  };

  const loadOptionsCitiesSerch = async (searchWord: string) => {
    return getCities(searchWord, 28).then((res: any[]) => res.map(citiesSearchMap));
  };

  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="p-5 sm:p-10 flex justify-between">
        <span className="font-titilliumBold text-xl text-gray-800">Date generale</span>

        <button
          type="button"
          className={classNames(readonly ? 'edit-button' : 'save-button')}
          onClick={readonly ? startEdit : handleSubmit(handleSave)}
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
                  values={[...domains]}
                  defaultItems={value}
                  error={errors[OrganizationActivityConfig.domains.key]?.message?.toString()}
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
              key={OrganizationActivityConfig.cities.key}
              name={OrganizationActivityConfig.cities.key}
              rules={OrganizationActivityConfig.cities.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <ServerSelect
                    value={value}
                    label={OrganizationActivityConfig.cities.label}
                    isMulti={true}
                    isClearable={false}
                    placeholder={''}
                    helperText={OrganizationActivityConfig.cities.helperText}
                    error={errors[OrganizationActivityConfig.cities.key]?.message?.toString()}
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
              key={OrganizationActivityConfig.regions.key}
              name={OrganizationActivityConfig.regions.key}
              rules={OrganizationActivityConfig.regions.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <Select
                    config={{
                      ...OrganizationActivityConfig.regions.config,
                      collection: regions,
                      displayedAttribute: 'name',
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
          {isPartOfFederation == 'true' && (
            <Controller
              key={OrganizationActivityConfig.federations.key}
              name={OrganizationActivityConfig.federations.key}
              rules={OrganizationActivityConfig.federations.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <Select
                    config={{
                      ...OrganizationActivityConfig.federations.config,
                      collection: federations,
                    }}
                    selected={value}
                    onChange={onChange}
                    readonly={readonly}
                  />
                );
              }}
            />
          )}
          <RadioGroup
            control={control}
            readonly={readonly}
            errors={errors[OrganizationActivityConfig.isPartOfCoalition.key]}
            config={OrganizationActivityConfig.isPartOfCoalition}
          />
          {isPartOfCoalition == 'true' && (
            <Controller
              key={OrganizationActivityConfig.coalitions.key}
              name={OrganizationActivityConfig.coalitions.key}
              rules={OrganizationActivityConfig.coalitions.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <Select
                    config={{
                      ...OrganizationActivityConfig.coalitions.config,
                      collection: coalitions,
                    }}
                    selected={value}
                    onChange={onChange}
                    readonly={readonly}
                  />
                );
              }}
            />
          )}

          <RadioGroup
            control={control}
            readonly={readonly}
            errors={errors[OrganizationActivityConfig.isPartOfInternationalOrganization.key]}
            config={OrganizationActivityConfig.isPartOfInternationalOrganization}
          />

          {isPartOfInternationalOrganization == 'true' && (
            <Controller
              key={OrganizationGeneralConfig.website.key}
              name={OrganizationGeneralConfig.website.key}
              rules={OrganizationGeneralConfig.website.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <InputField
                    config={{
                      ...OrganizationGeneralConfig.website.config,
                      name: OrganizationGeneralConfig.website.key,
                      error: errors[OrganizationGeneralConfig.website.key]?.message,
                      defaultValue: value,
                      onChange: onChange,
                    }}
                    readonly={readonly}
                  />
                );
              }}
            />
          )}
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
          {hasBranches == 'true' && (
            <Controller
              key={OrganizationActivityConfig.branches.key}
              name={OrganizationActivityConfig.branches.key}
              rules={OrganizationActivityConfig.branches.rules}
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <ServerSelect
                    value={value}
                    label={OrganizationActivityConfig.branches.label}
                    isMulti={true}
                    isClearable={false}
                    placeholder={''}
                    helperText={OrganizationActivityConfig.branches.helperText}
                    error={errors[OrganizationActivityConfig.branches.key]?.message?.toString()}
                    onChange={onChange}
                    loadOptions={loadOptionsCitiesSerch}
                    readonly={readonly}
                  />
                );
              }}
            />
          )}
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
