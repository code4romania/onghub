import {
  PaperClipIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  XCircleIcon,
  XIcon,
} from '@heroicons/react/solid';
import React, { useEffect, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { FILE_TYPES_ACCEPT } from '../../../common/constants/file.constants';
import { fileToURL, flatten } from '../../../common/helpers/format.helper';
import { updateActiveStepIndexInLocalStorage } from '../../../common/helpers/utils.helper';
import { useInitStep } from '../../../common/hooks/useInitStep';
import { Person } from '../../../common/interfaces/person.interface';
import ContactForm from '../../../components/Contact/Contact';
import ConfirmationModal from '../../../components/confim-removal-modal/ConfirmationModal';
import DataTableComponent from '../../../components/data-table/DataTableComponent';
import PopoverMenu, { PopoverMenuRowType } from '../../../components/popover-menu/PopoverMenu';
import SectionHeader from '../../../components/section-header/SectionHeader';
import { OrganizationLegalConfig } from '../../organization/components/OrganizationLegal/OrganizationLegalConfig';
import DirectorModal from '../../organization/components/OrganizationLegal/components/DirectorModal';
import OtherModal from '../../organization/components/OrganizationLegal/components/OtherModal';
import { DirectorsTableHeaders } from '../../organization/components/OrganizationLegal/table-headers/DirectorsTable.headers';
import { OthersTableHeaders } from '../../organization/components/OrganizationLegal/table-headers/OthersTable.headers';
import { Contact } from '../../organization/interfaces/Contact.interface';
import { CREATE_LOCAL_STORAGE_KEY } from '../constants/CreateOrganization.constant';
import GenericFormErrorMessage from '../../../components/generic-form-error-message/GenericFormErrorMessage';

const CreateOrganizationLegal = () => {
  const [isEditMode] = useState(true);
  // directors
  const [directors, setDirectors] = useState<Partial<Contact>[]>([]);
  const [directorsDeleted, setDirectorsDeleted] = useState<number[]>([]);
  const [isDirectorModalOpen, setIsDirectorModalOpen] = useState<boolean>(false);
  const [isDeleteDirectorModalOpen, setIsDeleteDirectorModalOpen] = useState<boolean>(false);
  const [selectedDirector, setSelectedDirector] = useState<Partial<Contact> | null>(null);
  // others
  const [others, setOthers] = useState<Partial<Person>[]>([]);
  const [isOtherModalOpen, setIsOtherModalOpen] = useState<boolean>(false);
  const [isDeleteOtheModalOpen, setIsDeleteOtherModalOpen] = useState<boolean>(false);
  const [selectedOther, setSelectedOther] = useState<Partial<Person> | null>(null);
  // queries

  const [
    organization,
    setOrganization,
    ,
    ,
    organizationStatute,
    setOrganizationStatute,
    activeStepIndex,
    setActiveStepIndex,
  ] = useOutletContext<any>();

  useInitStep(setOrganization);

  const { t } = useTranslation(['legal', 'common']);

  const navigate = useNavigate();

  // React Hook Form
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitted, errors, isValidating },
    getValues,
    watch,
    reset,
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  //Store form data in local storage
  const watchAllFields = watch();
  useEffect(() => {
    const legal = getValues();
    //Prevent filling localStorage with undefined data and prevent filling it with erros
    const hasAdminValues = !!Object.values(legal).filter((item) => item !== undefined).length;
    const hasFieldErrors = !!Object.keys(errors).length;

    const legalReprezentative = {
      id: legal.legalReprezentative_id,
      fullName: legal.legalReprezentative_fullName,
      phone: legal.legalReprezentative_phone,
      email: legal.legalReprezentative_email,
    };

    //Using isValidating because RHF triggers 2 renders and update local storage with invalid data
    if (hasAdminValues && !isValidating && !hasFieldErrors) {
      localStorage.setItem(
        CREATE_LOCAL_STORAGE_KEY,
        JSON.stringify({ ...organization, legal: { legalReprezentative, others, directors } }),
      );
    }
  }, [watchAllFields, others, directors]);

  useEffect(() => {
    if (organization && organization.legal) {
      const legalReprezentative = flatten(
        organization.legal.legalReprezentative,
        {},
        'legalReprezentative',
      );
      reset({ ...legalReprezentative });
      // OR added in order for others and directors to be not undefined
      setOthers(organization.legal.others || []);
      setDirectors(organization.legal.directors || []);
    }
  }, [organization]);

  const buildDirectorActionColumn = (): TableColumn<Contact> => {
    const menuItems = [
      {
        name: t('edit', { ns: 'common' }),
        icon: PencilIcon,
        onClick: onEditDirector,
      },
      {
        name: t('delete_data', { ns: 'common' }),
        icon: TrashIcon,
        onClick: onOpenDeleteDirectorModal,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    return {
      name: '',
      cell: (row: Contact) =>
        isEditMode ? <PopoverMenu row={row} menuItems={menuItems} /> : <></>,
      width: '50px',
      allowOverflow: true,
    };
  };

  const buildOtherActionColumn = (): TableColumn<Person> => {
    const menuItems = [
      {
        name: t('edit', { ns: 'common' }),
        icon: PencilIcon,
        onClick: onEditOther,
      },
      {
        name: t('delete_data', { ns: 'common' }),
        icon: TrashIcon,
        onClick: onOpenDeleteOtherModal,
        type: PopoverMenuRowType.REMOVE,
      },
    ];

    return {
      name: '',
      cell: (row: Person) => (isEditMode ? <PopoverMenu row={row} menuItems={menuItems} /> : <></>),
      width: '50px',
      allowOverflow: true,
    };
  };

  const onAddDirector = (contact: Partial<Contact>) => {
    setDirectors([...directors, contact]);
    setIsDirectorModalOpen(false);
  };

  const onEditDirector = (row: Contact) => {
    setSelectedDirector(row);
    setIsDirectorModalOpen(true);
  };

  const onUpdateDirector = (contact: Partial<Contact>) => {
    const filteredDirectors = directors.filter(
      (director: Partial<Contact>) =>
        !(
          director.fullName === selectedDirector?.fullName &&
          director.email === selectedDirector?.email &&
          director.phone === selectedDirector?.phone
        ),
    );
    setDirectors([...filteredDirectors, { ...selectedDirector, ...contact }]);
    setSelectedDirector(null);
    setIsDirectorModalOpen(false);
  };

  const onOpenDeleteDirectorModal = (row: Contact) => {
    setSelectedDirector(row);
    setIsDeleteDirectorModalOpen(true);
  };

  const onDeleteDirector = () => {
    if (selectedDirector?.id) {
      setDirectorsDeleted([...directorsDeleted, selectedDirector.id]);
    }
    const filteredDirectors = directors.filter(
      (director: Partial<Contact>) =>
        !(
          director.fullName === selectedDirector?.fullName &&
          director.email === selectedDirector?.email &&
          director.phone === selectedDirector?.phone
        ),
    );
    setDirectors(filteredDirectors);
    setSelectedDirector(null);
    setIsDeleteDirectorModalOpen(false);
  };

  const onEditOther = (row: Person) => {
    setSelectedOther(row);
    setIsOtherModalOpen(true);
  };

  const onOpenDeleteOtherModal = (row: Person) => {
    setSelectedOther(row);
    setIsDeleteOtherModalOpen(true);
  };

  const onAddOther = (other: Partial<Person>) => {
    setOthers([...others, other]);
    setIsOtherModalOpen(false);
  };

  const onUpdateOther = (person: Partial<Person>) => {
    const filteredOthers = others.filter(
      (other: Partial<Person>) =>
        !(other.fullName === selectedOther?.fullName && other.role === selectedOther?.role),
    );
    setOthers([...filteredOthers, person]);
    setSelectedOther(null);
    setIsOtherModalOpen(false);
  };

  const onDeleteOther = () => {
    const filteredOthers = others.filter(
      (other: Partial<Person>) =>
        !(other.fullName === selectedOther?.fullName && other.role === selectedOther?.role),
    );
    setOthers(filteredOthers);
    setSelectedOther(null);
    setIsDeleteOtherModalOpen(false);
  };

  const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setOrganizationStatute(file);
    } else {
      event.target.value = '';
    }
  };

  const onRemoveOrganizationStatute = (e: any) => {
    e.preventDefault();
    setOrganizationStatute(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSave = (data: any) => {
    if (directors.length < 3) {
      return;
    }

    const legalReprezentative = {
      id: data.legalReprezentative_id,
      fullName: data.legalReprezentative_fullName,
      phone: data.legalReprezentative_phone,
      email: data.legalReprezentative_email,
    };

    updateActiveStepIndexInLocalStorage(activeStepIndex, 4, setActiveStepIndex);
    setOrganization((org: any) => ({
      ...org,
      legal: { legalReprezentative, directors, directorsDeleted, others, organizationStatute },
    }));
  };

  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="p-5 sm:p-10">
        <div className="flex flex-col sm:gap-16 gap-4 w-full divide-y divide-gray-200 divide xl:w-1/2">
          <section className="flex flex-col gap-6 w-full">
            <SectionHeader
              title={t('representative')}
              subTitle={t('representative_information')}
            />
            <form className="space-y-8">
              <ContactForm
                className="flex-row gap-x-6 sm:flex-nowrap flex-wrap"
                control={control}
                errors={errors}
                readonly={!isEditMode}
                configs={[
                  OrganizationLegalConfig.legal_reprezentative_name,
                  OrganizationLegalConfig.legal_reprezentative_email,
                  OrganizationLegalConfig.legal_reprezentative_phone,
                ]}
                id="create-organization-legal"
              />
            </form>
          </section>
          <section className="flex flex-col gap-6 w-full pt-8">
            <SectionHeader title={t('director')} subTitle={t('director_information')} />
            {isEditMode && directors.length < 3 && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{t('dir_minimum')}</h3>
                  </div>
                </div>
              </div>
            )}
            <DataTableComponent
              columns={[...DirectorsTableHeaders, buildDirectorActionColumn()]}
              data={directors}
            />
            {isEditMode && (
              <button
                aria-label={t('add')}
                id="create-organization-legal__button__add-director"
                type="button"
                className="add-button max-w-[12rem] w-fit"
                onClick={setIsDirectorModalOpen.bind(null, true)}
              >
                <PlusIcon className="-ml-1 mr-2 sm:h-5 sm:w-5 h-4 w-4" aria-hidden="true" />
                {t('add')}
              </button>
            )}
          </section>
          <section className="flex flex-col gap-6 w-full pt-8">
            <SectionHeader title={t('other')} subTitle={t('other_information')} />
            <DataTableComponent
              columns={[...OthersTableHeaders, buildOtherActionColumn()]}
              data={others}
            />
            {isEditMode && (
              <button
                aria-label={t('add')}
                id="create-organization-legal__button__add-other"
                type="button"
                className="add-button max-w-[12rem] w-fit"
                onClick={setIsOtherModalOpen.bind(null, true)}
              >
                <PlusIcon className="-ml-1 mr-2 sm:h-5 sm:w-5 h-4 w-4" aria-hidden="true" />
                {t('add')}
              </button>
            )}
          </section>
          <section className="flex flex-col gap-6 w-full pt-8">
            <SectionHeader title={t('statute')} subTitle={t('statute_information')} />
            <div className="flex flex-col gap-y-4">
              <h3>{t('document')}</h3>
              {isEditMode && organizationStatute === null && (
                <>
                  <label
                    htmlFor="create-organization-legal__statute-upload"
                    className="w-fit min-w-32 flex items-center cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm leading-5 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PlusIcon className="-ml-1 mr-2 sm:h-5 sm:w-5 h-4 w-4" aria-hidden="true" />
                    {t('statute_upload')}
                  </label>
                  <input
                    className="h-0 w-0"
                    name="uploadStatute"
                    id="create-organization-legal__statute-upload"
                    type="file"
                    accept={FILE_TYPES_ACCEPT.STATUTE}
                    onChange={onChangeFile}
                  />
                </>
              )}
              {organizationStatute && (
                <a
                  aria-label={t('file_name')}
                  href={fileToURL(organizationStatute) || ''}
                  download={organizationStatute?.name || ''}
                  className="text-indigo-600 font-medium text-sm flex items-center"
                >
                  <PaperClipIcon className=" w-4 h-4 text-gray-600" />
                  {t('file_name')}
                  {isEditMode && (
                    <XIcon
                      className="ml-2 w-4 h-4 text-gray-600"
                      onClick={onRemoveOrganizationStatute}
                    />
                  )}
                </a>
              )}
            </div>
          </section>
          {isDirectorModalOpen && (
            <DirectorModal
              isEdit={selectedDirector !== null}
              defaultValue={selectedDirector || {}}
              onSave={selectedDirector !== null ? onUpdateDirector : onAddDirector}
              onClose={() => {
                setIsDirectorModalOpen(false);
                setSelectedDirector(null);
              }}
              id="create-organization-legal__director_modal"
            />
          )}
          {isOtherModalOpen && (
            <OtherModal
              isEdit={selectedOther !== null}
              defaultValue={selectedOther || {}}
              onSave={selectedOther !== null ? onUpdateOther : onAddOther}
              onClose={() => {
                setIsOtherModalOpen(false);
                setSelectedOther(null);
              }}
              id="create-organization-legal__director-modal"
            />
          )}
          {isDeleteDirectorModalOpen && (
            <ConfirmationModal
              title={t('delete_director_modal.title')}
              description={t('delete_director_modal.description')}
              closeBtnLabel={t('back', { ns: 'common' })}
              confirmBtnLabel={t('delete', { ns: 'common' })}
              onClose={() => {
                setIsDeleteDirectorModalOpen(false);
                setSelectedDirector(null);
              }}
              onConfirm={onDeleteDirector}
            />
          )}
          {isDeleteOtheModalOpen && (
            <ConfirmationModal
              title={t('delete_other_modal.title')}
              description={t('delete_other_modal.description')}
              closeBtnLabel={t('back', { ns: 'common' })}
              confirmBtnLabel={t('delete', { ns: 'common' })}
              onClose={() => {
                setIsDeleteOtherModalOpen(false);
                setSelectedOther(null);
              }}
              onConfirm={onDeleteOther}
            />
          )}
        </div>
        <div className="pt-5 sm:pt-6 sm:flex sm:flex-row-reverse">
          <button
            aria-label={t('send', { ns: 'common' })}
            id="create-organization-legal__button-send"
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 sm:text-sm lg:text-base text-xs font-medium text-black hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto"
            onClick={handleSubmit(handleSave)}
          >
            {t('send', { ns: 'common' })}
          </button>
          <button
            aria-label={t('back', { ns: 'common' })}
            id="create-organization-legal__button-back"
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white sm:text-sm lg:text-base text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto"
            onClick={() => navigate('/new/activity')}
          >
            {t('back', { ns: 'common' })}
          </button>
        </div>
        {((!isValid && isSubmitted) || directors.length < 3) && <GenericFormErrorMessage />}
      </div>
    </div>
  );
};

export default CreateOrganizationLegal;
