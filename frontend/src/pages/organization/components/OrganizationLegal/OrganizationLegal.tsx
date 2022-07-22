import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/solid';
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

const OrganizationLegal = () => {
  const [isEditMode, setEditMode] = useState(false);
  const [directors, setDirectors] = useState<Partial<Contact>[]>([]);
  const [others, setOthers] = useState<Partial<Person>[]>([]);

  const [isDirectorModalOpen, setIsDirectorModalOpen] = useState<boolean>(false);
  const [selectedDirector, setSelectedDirector] = useState<Partial<Contact> | null>(null);
  const [isOtherModalOpen, setIsOtherModalOpen] = useState<boolean>(false);
  const [selectedOther, setSelectedOther] = useState<Partial<Person> | null>(null);

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
        onClick: onDeleteDirector,
        isRemove: true,
      },
    ];

    return {
      name: '',
      cell: (row: Contact) => <PopoverMenu row={row} menuItems={menuItems} />,
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
        onClick: onDeleteOther,
        isRemove: true,
      },
    ];

    return {
      name: '',
      cell: (row: Person) => <PopoverMenu row={row} menuItems={menuItems} />,
      width: '50px',
      allowOverflow: true,
    };
  };

  const onEditDirector = (row: Contact) => {
    setSelectedDirector(row);
    setIsDirectorModalOpen(true);
  };

  const onDeleteDirector = (row: Contact) => {
    console.log('row', row);
  };

  const onEditOther = (row: Person) => {
    setSelectedOther(row);
    setIsOtherModalOpen(true);
  };

  const onDeleteOther = (row: Person) => {
    console.log('row', row);
  };

  const handleSave = (data: any) => {
    const legalReprezentative = {
      id: data.legalReprezentative_id,
      fullName: data.legalReprezentative_fullName,
      phone: data.legalReprezentative_phone,
      email: data.legalReprezentative_email,
    };

    mutate({ id: 1, organization: { legal: { legalReprezentative } } });

    setEditMode(false);
  };

  const onUploadFile = () => {
    console.log('on upload file');
  };

  const onAddDirector = (contact: Partial<Contact>) => {
    setDirectors([...directors, contact]);
    setIsDirectorModalOpen(false);
  };

  const onUpdateDirector = (contact: Partial<Contact>) => {
    setDirectors([
      ...directors.filter((director: Partial<Contact>) => director.id !== contact?.id),
      contact,
    ]);
    setSelectedDirector(null);
    setIsDirectorModalOpen(false);
  };

  const onAddOther = (other: Partial<Person>) => {
    setOthers([...others, other]);
    setIsOtherModalOpen(false);
  };

  const onUpdateOther = (other: Partial<Person>) => {
    setOthers([
      ...directors.filter((other: Partial<Person>) => other.fullName !== other?.fullName),
      other,
    ]);
    setSelectedOther(null);
    setIsOtherModalOpen(false);
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
            <DataTableComponent
              columns={[...DirectorsTableHeaders, buildDirectorActionColumn()]}
              data={directors}
            />
            <button
              type="button"
              className="add-button max-w-[12rem]"
              onClick={setIsDirectorModalOpen.bind(null, true)}
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Adauga un membru
            </button>
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
            <button
              type="button"
              className="add-button max-w-[12rem]"
              onClick={setIsOtherModalOpen.bind(null, true)}
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Adauga un membru
            </button>
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
        </div>
      </div>
    </div>
  );
};

export default OrganizationLegal;
