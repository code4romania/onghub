import { PencilIcon, PlusIcon, TrashIcon, XCircleIcon } from '@heroicons/react/solid';
import React, { useState, useEffect } from 'react';
import { TableColumn } from 'react-data-table-component';
import { useForm } from 'react-hook-form';
import { classNames } from '../../../../common/helpers/tailwind.helper';
import { Person } from '../../../../common/interfaces/person.interface';
import ContactForm from '../../../../components/Contact/Contact';
import DataTableComponent from '../../../../components/data-table/DataTableComponent';
import PopoverMenu from '../../../../components/popover-menu/PopoverMenu';
import SectionHeader from '../../../../components/section-header/SectionHeader';
import { useSelectedOrganization } from '../../../../store/selectors';
import { Contact } from '../../interfaces/Contact.interface';
import DirectorModal from './components/DirectorModal';
import OtherModal from './components/OtherModal';
import { DirectorsTableHeaders } from './table-headers/DirectorsTable.headers';
import { OrganizationLegalConfig } from './OrganizationLegalConfig';
import { OthersTableHeaders } from './table-headers/OthersTable.headers';
import { flatten } from '../../../../common/helpers/format.helper';
import { useOrganizationMutation } from '../../../../services/organization/Organization.queries';
import { useErrorToast } from '../../../../common/hooks/useToast';
import DeleteRowConfirmationModal from './components/DeleteRowConfirmationModal';

const OrganizationLegal = () => {
  const [isEditMode, setEditMode] = useState(false);
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
  const { organizationLegal } = useSelectedOrganization();
  const { mutate, error } = useOrganizationMutation();

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
      setOthers(organizationLegal.others);
      setDirectors(organizationLegal.directors);
    }
  }, [organizationLegal]);

  useEffect(() => {
    if (error) useErrorToast('Error while saving organization');
  }, [error]);

  const buildDirectorActionColumn = (): TableColumn<Contact> => {
    const menuItems = [
      {
        name: 'edit',
        icon: PencilIcon,
        onClick: onEditDirector,
      },
      {
        name: 'Elimina date',
        icon: TrashIcon,
        onClick: onOpenDeleteDirectorModal,
        isRemove: true,
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
        name: 'edit',
        icon: PencilIcon,
        onClick: onEditOther,
      },
      {
        name: 'Elimina date',
        icon: TrashIcon,
        onClick: onOpenDeleteOtherModal,
        isRemove: true,
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

    mutate({
      id: 3,
      organization: { legal: { legalReprezentative, directors, directorsDeleted, others } },
    });

    setEditMode(false);
  };

  const onUploadFile = () => {
    console.log('on upload file');
  };

  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="p-5 sm:p-10 flex justify-between">
        <span className="font-titilliumBold text-xl text-gray-800">Informatii Legale</span>
        <button
          type="button"
          className={classNames(isEditMode ? 'save-button' : 'edit-button')}
          onClick={
            !isEditMode
              ? setEditMode.bind(null, true)
              : () => {
                  handleSubmit(handleSave)();
                }
          }
        >
          <PencilIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          {isEditMode ? 'Salveaza modificari' : 'Editeaza'}
        </button>
      </div>

      <div className="w-full border-t border-gray-300" />
      <div className="p-5 sm:p-10">
        <div className="flex flex-col gap-16 w-full divide-y divide-gray-200 divide xl:w-1/2">
          <section className="flex flex-col gap-6 w-full">
            <SectionHeader
              title="Reprezentant Legal al organizatiei"
              subTitle="This information will be displayed publicly so be careful what you share"
            />
            <form className="space-y-8">
              <ContactForm
                className="flex-row gap-x-6"
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
            <SectionHeader
              title="Consiliul director al organizatiei"
              subTitle="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero, autem. Eum voluptatem accusantium officia porro asperiores."
            />
            {isEditMode && directors.length < 3 && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Este obligatoriu sa adaugi cel putin 3 membri ai consiliului director pentru a
                      continua
                    </h3>
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
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Adauga un membru
              </button>
            )}
          </section>
          <section className="flex flex-col gap-6 w-full pt-8">
            <SectionHeader
              title="Alte persoane relevante in organizatie"
              subTitle="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero, autem. Eum voluptatem accusantium officia porro asperiores."
            />
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
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                Adauga un membru
              </button>
            )}
          </section>
          <section className="flex flex-col gap-6 w-full pt-8">
            <SectionHeader
              title="Statutul organizatiei"
              subTitle="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero, autem. Eum voluptatem accusantium officia porro asperiores."
            />
            <div className="flex flex-col gap-y-4">
              <h3>Document</h3>
              <button type="button" className="add-button max-w-[8rem]" onClick={onUploadFile}>
                Incarca fisier
              </button>
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
