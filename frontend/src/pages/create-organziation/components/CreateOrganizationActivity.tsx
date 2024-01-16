import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  ISelectData,
  mapCitiesToSelect,
  mapGroupsToSelect,
  mapNameToSelect,
  str2bool,
} from '../../../common/helpers/format.helper';
import ChipSelection from '../../../components/chip-selection/ChipSelection';
import InputField from '../../../components/InputField/InputField';
import MultiSelect from '../../../components/multi-select/MultiSelect';
import RadioGroup from '../../../components/RadioGroup/RadioGroup';
import ServerSelect from '../../../components/server-select/ServerSelect';
import {
  useCoalitionsQuery,
  useDomainsQuery,
  useFederationsQuery,
  useRegionsQuery,
} from '../../../services/nomenclature/Nomenclature.queries';
import { getCities } from '../../../services/nomenclature/Nomenclatures.service';
import { parseOrganizationActivityDataToPayload } from '../../../services/organization/Organization.helper';
import { useNomenclature } from '../../../store/selectors';
import {
  OrganizationActivityConfig,
  OrganizationAreaEnum,
} from '../../organization/components/OrganizationActivity/OrganizationActivityConfig';
import {
  CREATE_FLOW_URL,
  CREATE_LOCAL_STORAGE_KEY,
} from '../constants/CreateOrganization.constant';
import { ICreateOrganizationPayload } from '../interfaces/CreateOrganization.interface';
import { updateActiveStepIndexInLocalStorage } from '../../../common/helpers/utils.helper';
import { useInitStep } from '../../../common/hooks/useInitStep';
import GenericFormErrorMessage from '../../../components/generic-form-error-message/GenericFormErrorMessage';
import { PlusIcon } from '@heroicons/react/solid';
import AddCoFedModal from '../../../components/add-fed-co-modal/AddFedCoModal';

const CreateOrganizationActivity = () => {
  const { domains, regions, federations, coalitions } = useNomenclature();

  const [organization, setOrganization, , , , , activeStepIndex, setActiveStepIndex] =
    useOutletContext<any>();

  useInitStep(setOrganization);

  const [isAddFederationModalOpen, setIsAddFederationModalOpen] = useState<boolean>(false);
  const [isAddCoalitionModalOpen, setIsAddCoalitionModalOpen] = useState<boolean>(false);

  const [newCoalitions, setNewCoalitions] = useState<ISelectData[]>([]);
  const [newFederations, setNewFederations] = useState<ISelectData[]>([]);

  const navigate = useNavigate();

  const { t } = useTranslation(['activity', 'common']);

  const [readonly] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitted, errors, isValidating },
    reset,
    watch,
    resetField,
    getValues,
    setValue,
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  //Store form data in local storage
  const watchAllFields = watch();
  useEffect(() => {
    if (activeStepIndex > 2) {
      return;
    }
    const activity = getValues();
    //Prevent filling localStorage with undefined data and prevent filling it with erros
    const hasAdminValues = !!Object.values(activity).filter((item) => item !== undefined).length;
    const hasFieldErrors = !!Object.keys(errors).length;

    //Using isValidating because RHF triggers 2 renders and update local storage with invalid data
    if (hasAdminValues && !isValidating && !hasFieldErrors) {
      localStorage.setItem(CREATE_LOCAL_STORAGE_KEY, JSON.stringify({ ...organization, activity }));
    }
  }, [watchAllFields]);

  //queries
  useDomainsQuery();
  useRegionsQuery();
  useFederationsQuery();
  useCoalitionsQuery();

  // watchers
  const area = watch('area');
  const isPartOfFederation = watch('isPartOfFederation');
  const isPartOfCoalition = watch('isPartOfCoalition');
  const isPartOfInternationalOrganization = watch('isPartOfInternationalOrganization');
  const hasBranches = watch('hasBranches');

  // submit
  const handleSave = (data: any) => {
    setOrganization((org: ICreateOrganizationPayload) => ({
      ...org,
      activity: parseOrganizationActivityDataToPayload(data),
    }));
    localStorage.setItem(
      CREATE_LOCAL_STORAGE_KEY,
      JSON.stringify({ ...organization, activity: parseOrganizationActivityDataToPayload(data) }),
    );

    navigate(`/${CREATE_FLOW_URL.BASE}/${CREATE_FLOW_URL.LEGAL}`);

    updateActiveStepIndexInLocalStorage(activeStepIndex, 4, setActiveStepIndex);
  };

  // load initial values
  useEffect(() => {
    if (organization && organization.activity) {
      reset({
        ...organization.activity,
        isPartOfFederation: organization.activity.isPartOfFederation?.toString(),
        isPartOfCoalition: organization.activity.isPartOfCoalition?.toString(),
        isPartOfInternationalOrganization:
          organization.activity.isPartOfInternationalOrganization?.toString(),
        isSocialServiceViable: organization.activity.isSocialServiceViable?.toString(),
        offersGrants: organization.activity.offersGrants?.toString(),
        hasBranches: organization.activity.hasBranches?.toString(),
        isPublicIntrestOrganization: organization.activity.isPublicIntrestOrganization?.toString(),
      });

      // init data if the user comes back to this page
      if (organization.activity.federations?.length > 0) {
        const fedValues = organization.activity.federations.filter((val: ISelectData) => val.isNew);
        setNewFederations(fedValues);
      }

      if (organization.activity.coalitions?.length > 0) {
        const colValues = organization.activity.coalitions.filter((val: ISelectData) => val.isNew);
        setNewCoalitions(colValues);
      }
    }
  }, [organization]);

  useEffect(() => {
    // This is the only conditional form field who has input validation that's why we handle it differently
    // TODO: Improve this
    if (isPartOfInternationalOrganization && !str2bool(isPartOfInternationalOrganization)) {
      // Remove international organization data from form
      resetField(OrganizationActivityConfig.internationalOrganizationName.key, {
        defaultValue: '',
      });
    }
  }, [isPartOfInternationalOrganization]);

  const loadOptionsCitiesSerch = async (searchWord: string) => {
    return getCities(searchWord).then((res) => res.map(mapCitiesToSelect));
  };

  const onAddNewFederation = ({ name }: { name: string }): void => {
    // generate new value
    const newValue = { value: name, label: name, isNew: true };
    // add the values to the additional federation array
    setNewFederations([...newFederations, newValue]);
    // close modal
    setIsAddFederationModalOpen(false);
    // handle form
    const form = getValues();
    const formValues = form.federations || [];
    resetField('federations');
    setValue('federations', [...formValues, newValue]);
  };

  const onAddNewCoalition = ({ name }: { name: string }): void => {
    // generate new value
    const newValue = { value: name, label: name, isNew: true };
    // add the values to the additional coalitions array
    setNewCoalitions([...newCoalitions, newValue]);
    // close modal
    setIsAddCoalitionModalOpen(false);
    // handle form
    const form = getValues();
    const formValues = form.coalitions || [];
    resetField('coalitions');
    setValue('coalitions', [...formValues, newValue]);
  };

  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="w-full" />
      <section className="p-5 sm:p-10">
        <div className="flex flex-col gap-4 divide-y divide-gray-200">
          <div className="flex flex-col gap-4 ">
            <div>
              <span className="sm:text-lg lg:text-xl text-md font-bold text-gray-900">
                {t('domains')}
              </span>
              <p className="mt-1 mb-4 text-sm text-gray-500 font-normal" id="email-description">
                {t('domains_information', { ns: 'activity' })}
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
                    id="create-organization-activity__domains"
                    {...OrganizationActivityConfig.domains.config}
                    values={[...domains]}
                    defaultItems={value}
                    error={errors[OrganizationActivityConfig.domains.key]?.message?.toString()}
                    onItemsChange={onChange}
                    readonly={readonly}
                  ></ChipSelection>
                );
              }}
            />
            <RadioGroup
              control={control}
              readonly={readonly}
              errors={errors[OrganizationActivityConfig.area.key]}
              config={OrganizationActivityConfig.area}
              id="create-organization-activity__area"
            />
            {area == OrganizationAreaEnum.LOCAL && (
              <Controller
                key={OrganizationActivityConfig.cities.key}
                name={OrganizationActivityConfig.cities.key}
                rules={OrganizationActivityConfig.cities.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <ServerSelect
                      id="create-organization-activity__cities"
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
            {area == OrganizationAreaEnum.REGIONAL && (
              <Controller
                key={OrganizationActivityConfig.regions.key}
                name={OrganizationActivityConfig.regions.key}
                rules={OrganizationActivityConfig.regions.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <MultiSelect
                      id="create-organziation-activity__regions"
                      value={value}
                      label={OrganizationActivityConfig.regions.config.label}
                      isClearable={false}
                      helperText={OrganizationActivityConfig.regions.config.helperText}
                      error={errors[OrganizationActivityConfig.regions.key]?.message?.toString()}
                      onChange={onChange}
                      options={[...regions.map(mapNameToSelect)]}
                      readonly={readonly}
                    />
                  );
                }}
              />
            )}
          </div>
          <div className="flex flex-col gap-4 pt-4">
            <div>
              <span className="sm:text-lg lg:text-xl text-md font-bold text-gray-900">
                {t('fed_coal')}
              </span>
              <p className="mt-1 mb-4 text-sm text-gray-500 font-normal" id="email-description">
                {t('fed_coal_information', { ns: 'activity' })}
              </p>
            </div>
            <RadioGroup
              control={control}
              readonly={readonly}
              errors={errors[OrganizationActivityConfig.isPartOfFederation.key]}
              config={OrganizationActivityConfig.isPartOfFederation}
              id="create-organization-activity__part-federation"
            />
            {(isPartOfFederation === 'true' || isPartOfFederation === true) && (
              <Controller
                key={OrganizationActivityConfig.federations.key}
                name={OrganizationActivityConfig.federations.key}
                rules={OrganizationActivityConfig.federations.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <div className="flex w-full items-center gap-2">
                      <MultiSelect
                        id="create-organization-activity__federations"
                        value={value}
                        label={OrganizationActivityConfig.federations.config.label}
                        isClearable={false}
                        helperText={OrganizationActivityConfig.federations.config.helperText}
                        error={errors[
                          OrganizationActivityConfig.federations.key
                        ]?.message?.toString()}
                        onChange={onChange}
                        options={[...federations.map(mapGroupsToSelect), ...newFederations]}
                        readonly={readonly}
                      />
                      <button
                        className="add-button"
                        onClick={setIsAddFederationModalOpen.bind(null, true)}
                      >
                        <PlusIcon className="w-5 h-5 fill-gray-500 " />
                      </button>
                    </div>
                  );
                }}
              />
            )}
            <RadioGroup
              control={control}
              readonly={readonly}
              errors={errors[OrganizationActivityConfig.isPartOfCoalition.key]}
              config={OrganizationActivityConfig.isPartOfCoalition}
              id="create-organization-activity__part-coalition"
            />
            {(isPartOfCoalition == 'true' || isPartOfCoalition === true) && (
              <Controller
                key={OrganizationActivityConfig.coalitions.key}
                name={OrganizationActivityConfig.coalitions.key}
                rules={OrganizationActivityConfig.coalitions.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <div className="flex w-full items-center gap-2">
                      <MultiSelect
                        id="create-organization-activity__coalitions"
                        value={value}
                        label={OrganizationActivityConfig.coalitions.config.label}
                        isClearable={false}
                        helperText={OrganizationActivityConfig.coalitions.config.helperText}
                        error={errors[
                          OrganizationActivityConfig.coalitions.key
                        ]?.message?.toString()}
                        onChange={onChange}
                        options={[...coalitions.map(mapGroupsToSelect), ...newCoalitions]}
                        readonly={readonly}
                      />
                      <button
                        className="add-button"
                        onClick={setIsAddCoalitionModalOpen.bind(null, true)}
                      >
                        <PlusIcon className="w-5 h-5 fill-gray-500 " />
                      </button>
                    </div>
                  );
                }}
              />
            )}

            <RadioGroup
              control={control}
              readonly={readonly}
              errors={errors[OrganizationActivityConfig.isPartOfInternationalOrganization.key]}
              config={OrganizationActivityConfig.isPartOfInternationalOrganization}
              id="create-organization-activity__part-international"
            />

            {(isPartOfInternationalOrganization == 'true' ||
              isPartOfInternationalOrganization === true) && (
              <Controller
                key={OrganizationActivityConfig.internationalOrganizationName.key}
                name={OrganizationActivityConfig.internationalOrganizationName.key}
                rules={OrganizationActivityConfig.internationalOrganizationName.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <InputField
                      config={{
                        ...OrganizationActivityConfig.internationalOrganizationName.config,
                        name: OrganizationActivityConfig.internationalOrganizationName.key,
                        error:
                          errors[OrganizationActivityConfig.internationalOrganizationName.key]
                            ?.message,
                        defaultValue: value,
                        onChange: onChange,
                        id: 'create-organization-activity__international-name',
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
              <span className="sm:text-lg lg:text-xl text-md font-bold text-gray-900">
                {t('branches')}
              </span>
              <p className="mt-1 mb-4 text-sm text-gray-500 font-normal" id="email-description">
                {t('branches_information', { ns: 'activity' })}
              </p>
            </div>
            <RadioGroup
              control={control}
              readonly={readonly}
              errors={errors[OrganizationActivityConfig.hasBranches.key]}
              config={OrganizationActivityConfig.hasBranches}
              id="create-organization-activity__has-branches"
            />
            {(hasBranches === 'true' || hasBranches === true) && (
              <Controller
                key={OrganizationActivityConfig.branches.key}
                name={OrganizationActivityConfig.branches.key}
                rules={OrganizationActivityConfig.branches.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <ServerSelect
                      id="create-organization-activity__branches"
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
              <span className="sm:text-lg lg:text-xl text-md font-bold text-gray-900">
                {t('other')}
              </span>
              <p className="mt-1 mb-4 text-sm text-gray-500 font-normal" id="email-description">
                {t('other_information', { ns: 'activity' })}
              </p>
            </div>
            <RadioGroup
              control={control}
              readonly={readonly}
              errors={errors[OrganizationActivityConfig.isSocialServiceViable.key]}
              config={OrganizationActivityConfig.isSocialServiceViable}
              id="create-organization-activity__social-viable"
            />
            <RadioGroup
              control={control}
              readonly={readonly}
              errors={errors[OrganizationActivityConfig.offersGrants.key]}
              config={OrganizationActivityConfig.offersGrants}
              id="create-organization-activity__offers-grants"
            />
            <RadioGroup
              control={control}
              readonly={readonly}
              errors={errors[OrganizationActivityConfig.isPublicIntrestOrganization.key]}
              config={OrganizationActivityConfig.isPublicIntrestOrganization}
              id="create-organization-activity__public-interest"
            />
          </div>
          <div className="pt-5 sm:pt-6 sm:flex sm:flex-row-reverse">
            <button
              aria-label={t('next', { ns: 'common' })}
              id="create-organization-activity__button-next"
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 sm:text-sm lg:text-base text-xs font-medium text-black hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto"
              onClick={handleSubmit(handleSave)}
            >
              {t('next', { ns: 'common' })}
            </button>
            <button
              aria-label={t('back', { ns: 'common' })}
              id="create-organization-activity__button-back"
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white sm:text-sm lg:text-base text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto"
              onClick={() => navigate(`/${CREATE_FLOW_URL.BASE}/${CREATE_FLOW_URL.GENERAL}`)}
            >
              {t('back', { ns: 'common' })}
            </button>
          </div>
        </div>
        {!isValid && isSubmitted && <GenericFormErrorMessage />}
      </section>
      {isAddFederationModalOpen && (
        <AddCoFedModal
          title={t('config.add_federation_modal.title')}
          description={t('config.add_federation_modal.description')}
          onClose={setIsAddFederationModalOpen.bind(null, false)}
          onSubmit={onAddNewFederation}
        />
      )}
      {isAddCoalitionModalOpen && (
        <AddCoFedModal
          title={t('config.add_coalition_modal.title')}
          description={t('config.add_coalition_modal.description')}
          onClose={setIsAddCoalitionModalOpen.bind(null, false)}
          onSubmit={onAddNewCoalition}
        />
      )}
    </div>
  );
};

export default CreateOrganizationActivity;
