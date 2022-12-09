import { PaperClipIcon, XIcon } from '@heroicons/react/outline';
import { PencilIcon, PlusIcon, TrashIcon, XCircleIcon } from '@heroicons/react/solid';
import React, { useContext, useEffect, useState } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { FILE_ERRORS } from '../../../../common/constants/error.constants';
import { fileToURL, flatten } from '../../../../common/helpers/format.helper';
import { classNames } from '../../../../common/helpers/tailwind.helper';
import { useErrorToast } from '../../../../common/hooks/useToast';
import { Person } from '../../../../common/interfaces/person.interface';
import ContactForm from '../../../../components/Contact/Contact';
import DataTableComponent from '../../../../components/data-table/DataTableComponent';
import PopoverMenu, { PopoverMenuRowType } from '../../../../components/popover-menu/PopoverMenu';
import SectionHeader from '../../../../components/section-header/SectionHeader';
import { AuthContext } from '../../../../contexts/AuthContext';
import {
  useOrganizationByProfileMutation,
  useOrganizationMutation,
} from '../../../../services/organization/Organization.queries';
import { useSelectedOrganization } from '../../../../store/selectors';
import { UserRole } from '../../../users/enums/UserRole.enum';
import { REQUEST_LOCATION } from '../../constants/location.constants';
import { Contact } from '../../interfaces/Contact.interface';
import DeleteRowConfirmationModal from './components/DeleteRowConfirmationModal';
import DirectorModal from './components/DirectorModal';
import OtherModal from './components/OtherModal';
import { OrganizationLegalConfig } from './OrganizationLegalConfig';
import { DirectorsTableHeaders } from './table-headers/DirectorsTable.headers';
import { OthersTableHeaders } from './table-headers/OthersTable.headers';

const OrganizationLegal = () => {
  const location = useLocation();

  const [isEditMode, setEditMode] = useState(false);
  const [organizationStatute, setOrganizationStatute] = useState<File | null>(null);
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
  const { organizationLegal, organization } = useSelectedOrganization();
  const { mutate: updateOrganization } = location.pathname.includes(REQUEST_LOCATION)
    ? useOrganizationMutation()
    : useOrganizationByProfileMutation();

  const { role } = useContext(AuthContext);
  // React i18n
  const { t } = useTranslation(['legal', 'organization', 'common']);

  // React Hook Form
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (organizationLegal) {
      const legalReprezentative = flatten(
        organizationLegal.legalReprezentative,
        {},
        'legalReprezentative',
      );
      reset({ ...legalReprezentative });
      setOthers(organizationLegal.others || []);
      setDirectors(organizationLegal.directors);
    }
  }, [organizationLegal]);

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
          director.phone === selectedDirector?.email
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
      (director: Partial<Contact>) => director.id !== selectedDirector?.id,
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

    updateOrganization(
      {
        id: organization?.id,
        organization: { legal: { legalReprezentative, directors, directorsDeleted, others } },
        logo: null,
        organizationStatute,
      },
      {
        onSuccess: () => {
          setOrganizationStatute(null);
        },
        onError: (error) => {
          const createError: any = error;
          const err = createError.response.data;
          if (err.code) {
            useErrorToast(FILE_ERRORS[err.code]);
          } else {
            useErrorToast(t('save_error', { ns: 'organization' }));
          }
        },
      },
    );

    setEditMode(false);
  };

  const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setOrganizationStatute(event.target.files[0]);
      event.target.value = '';
    } else {
      event.target.value = '';
    }
  };

  const onRemoveOrganizationStatute = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    setOrganizationStatute(null);
  };

  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="py-5 lg:px-10 px-5 flex justify-between items-center">
        <span className="font-titilliumBold sm:text-lg lg:text-xl text-md text-gray-800">
          {t('title')}
        </span>
        {role !== UserRole.EMPLOYEE && (
          <button
            type="button"
            className={classNames(
              isEditMode ? 'save-button' : 'edit-button',
              'sm:text-sm lg:text-base text-xs',
            )}
            onClick={
              !isEditMode
                ? setEditMode.bind(null, true)
                : () => {
                    handleSubmit(handleSave)();
                  }
            }
          >
            <PencilIcon className="-ml-1 mr-2 sm:h-5 sm:w-5 h-4 w-4" aria-hidden="true" />
            {isEditMode ? t('save', { ns: 'common' }) : t('edit', { ns: 'common' })}
          </button>
        )}
      </div>

      <div className="w-full border-t border-gray-300" />
      <div className="p-5 sm:p-10">
        <div className="flex flex-col sm:gap-16 gap-4 w-full divide-y divide-gray-200 divide">
          <section className="flex flex-col gap-6 w-full">
            <SectionHeader
              title={t('representative')}
              subTitle={t('information', { ns: 'common' })}
            />
            <form className="space-y-8">
              <ContactForm
                className="lg:flex-row flex-col gap-x-6 gap-y-3"
                control={control}
                errors={errors}
                readonly={!isEditMode}
                configs={[
                  OrganizationLegalConfig.legal_reprezentative_name,
                  OrganizationLegalConfig.legal_reprezentative_email,
                  OrganizationLegalConfig.legal_reprezentative_phone,
                ]}
              />
            </form>
          </section>
          <section className="flex flex-col gap-6 w-full pt-8">
            <SectionHeader title={t('director')} subTitle={t('information', { ns: 'common' })} />
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
                type="button"
                className="add-button max-w-[12rem]"
                onClick={setIsDirectorModalOpen.bind(null, true)}
              >
                <PlusIcon className="-ml-1 mr-2 sm:h-5 sm:w-5 h-4 w-4" aria-hidden="true" />
                {t('add')}
              </button>
            )}
          </section>
          <section className="flex flex-col gap-6 w-full pt-8">
            <SectionHeader title={t('other')} subTitle={t('information', { ns: 'common' })} />
            <DataTableComponent
              columns={[...OthersTableHeaders, buildOtherActionColumn()]}
              data={others}
            />
            {isEditMode && (
              <button
                type="button"
                className="add-button max-w-[12rem]"
                onClick={setIsOtherModalOpen.bind(null, true)}
              >
                <PlusIcon className="-ml-1 mr-2 sm:h-5 sm:w-5 h-4 w-4" aria-hidden="true" />
                {t('add')}
              </button>
            )}
          </section>
          <section className="flex flex-col gap-6 w-full pt-8">
            <SectionHeader title={t('statute')} subTitle={t('information', { ns: 'common' })} />
            <div className="flex flex-col gap-y-4">
              <h3>{t('document')}</h3>
              {isEditMode &&
                organizationLegal?.organizationStatute === null &&
                organizationStatute === null && (
                  <>
                    <label
                      htmlFor="uploadPhoto"
                      className="w-32 cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {t('statute_upload')}
                    </label>
                    <input
                      className="h-0 w-0"
                      name="uploadPhoto"
                      id="uploadPhoto"
                      type="file"
                      onChange={onChangeFile}
                    />
                  </>
                )}
              {(organizationLegal?.organizationStatute || organizationStatute) && (
                <a
                  href={fileToURL(organizationStatute) || organizationLegal?.organizationStatute}
                  download
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
            />
          )}
          {isDeleteDirectorModalOpen && (
            <DeleteRowConfirmationModal
              onClose={() => {
                setIsDeleteDirectorModalOpen(false);
                setSelectedDirector(null);
              }}
              onConfirm={onDeleteDirector}
            />
          )}
          {isDeleteOtheModalOpen && (
            <DeleteRowConfirmationModal
              onClose={() => {
                setIsDeleteOtherModalOpen(false);
                setSelectedOther(null);
              }}
              onConfirm={onDeleteOther}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizationLegal;
