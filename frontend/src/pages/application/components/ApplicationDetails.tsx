import React, { useState } from 'react';
import { GlobeAltIcon, PlusIcon, XIcon } from '@heroicons/react/outline';
import logo from '../../../assets/images/logo.svg';
import { useSelectedApplication } from '../../../store/selectors';
import { useAuthContext } from '../../../contexts/AuthContext';
import { UserRole } from '../../users/enums/UserRole.enum';
import { ApplicationPermission } from '../../../services/application/interfaces/Application.interface';
import { ApplicationTypeEnum } from '../../apps-store/constants/ApplicationType.enum';
import { CheckCircleIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
import ConfirmationModal from '../../../components/confim-removal-modal/ConfirmationModal';

const ApplicationDetails = () => {
  const [isConfirmationModalOpen, setConfirmaitonModalOpen] = useState(false);
  const { applicationResponse } = useSelectedApplication();
  const { role } = useAuthContext();

  return (
    <div className="flex gap-4 mr-1 mb-1 relative">
      <div className="flex flex-col rounded-lg bg-white shadow w-96 p-8 divide-y divide-gray-200 h-full">
        <div className="flex flex-col gap-4 min-h-full">
          <img
            src={applicationResponse?.application?.logo || logo}
            className="h-full w-full pt-10 pb-10"
          />
          <p className="font-titilliumBold text-black text-xl tracking-wide">
            {applicationResponse?.application?.name}
          </p>
          <div className="flex gap-2 pb-2 items-center">
            <GlobeAltIcon className="h-4 w-4" />
            <p
              className="hover:text-blue-800 hover:cursor-pointer"
              onClick={() => {
                window.location.href = applicationResponse?.application?.website || '';
              }}
            >
              Vezi website
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-4 pb-4">
          <p>Cum poti folosi aplicatia pentru organizatia ta?</p>
          {applicationResponse?.application?.steps.map((step: any, index: number) => (
            <div className="flex gap-4 items-center" key={index}>
              <div className="rounded-full border-2 m-0 p-4 flex justify-center items-center w-4 h-4">
                {index + 1}
              </div>
              {step}
            </div>
          ))}
        </div>

        {role === UserRole.ADMIN && (
          <div>
            {/* The application is not added */}
            {!applicationResponse?.status && (
              <div className="flex pt-4 gap-4 items-center justify-center">
                <button className="save-button pl-8 pr-8 flex gap-4">
                  <PlusIcon className="h-5 w-5" />
                  Solicita aplicatia
                </button>
              </div>
            )}
            {/* The application was restricted */}
            {applicationResponse?.status === ApplicationPermission.RESTRICTED && (
              <div className="flex pt-4 gap-4 items-center justify-center">
                <p className="">Accesul la aplicatie a fost restrictionat.</p>
              </div>
            )}
            {/* The application is independent and active */}
            {applicationResponse?.application.type === ApplicationTypeEnum.INDEPENDENT &&
              applicationResponse?.status === ApplicationPermission.ACTIVE && (
                <div className="flex pt-4 gap-4 items-center justify-center">
                  <p className="text-gray-700 font-titilliumBold">
                    Aplicația este adaugata automat la crearea contului ONG Hub si nu poate fi
                    dezactivata.
                  </p>
                </div>
              )}
            {/* The application is not independent and active */}
            {applicationResponse?.application.type !== ApplicationTypeEnum.INDEPENDENT &&
              applicationResponse?.status === ApplicationPermission.ACTIVE && (
                <div className="flex pt-4 gap-4 items-center justify-center">
                  <button
                    className="edit-button pl-8 pr-8 flex gap-4"
                    onClick={() => setConfirmaitonModalOpen(true)}
                  >
                    <XIcon className="h-5 w-5" />
                    Elimina aplicatie
                  </button>
                </div>
              )}
            {/* The application is not independent and pending */}
            {applicationResponse?.application.type !== ApplicationTypeEnum.INDEPENDENT &&
              applicationResponse?.status === ApplicationPermission.PENDING && (
                <div className="flex flex-col pt-4 gap-4 items-center justify-center">
                  <button className="save-button pl-8 pr-8 flex gap-4" disabled>
                    <PlusIcon className="h-5 w-5" />
                    Solicita aplicatia
                  </button>
                  <p>Te vom contacta in 24-48 de ore.</p>
                </div>
              )}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 w-full h-full">
        {role === UserRole.ADMIN && (
          <React.Fragment>
            {applicationResponse?.status === ApplicationPermission.ACTIVE && (
              <div className="w-full h-full bg-white shadow rounded-lg">
                <div className="py-5 px-10 flex gap-2 items-center">
                  <CheckCircleIcon className="text-green w-6 w-6" />
                  <span className="font-titilliumBold text-xl text-gray-800">
                    Aplicația este activă pentru organizația ta.
                  </span>
                </div>
                <div className="w-full border-t border-gray-300" />
                <div className="p-8 flex flex-col gap-4">
                  <p className="break-all">
                    Lorem ipsum. Ce inseamna faptul ca aplicatia este activa. Conform cu nevoile
                    ONG-ului tau. Un membru al echipei Code for Romania te va contacta pentru
                    detalii suplimentare in cel mai scurt timp, pe emailul persoanei de contact
                    mentionat in profilul tau de organizatie. Iti multumim!
                  </p>
                  <div>
                    <button className="save-button pl-8 pr-8 flex gap-4">Deschide aplicatia</button>
                  </div>
                </div>
              </div>
            )}
            {applicationResponse?.status === ApplicationPermission.PENDING && (
              <div className="w-full h-full bg-white shadow rounded-lg">
                <div className="py-5 px-10 flex gap-2 items-center">
                  <ClockIcon className="w-6 h-6  text-yellow-600" />
                  <span className="font-titilliumBold text-xl text-gray-800 ">
                    Solicitarea ta așteaptă aprobare.
                  </span>
                </div>
                <div className="w-full border-t border-gray-300" />
                <div className="p-8 flex flex-col gap-4">
                  <p className="break-all">
                    Aplicatia aceasta trebuie instalata si configurata conform cu nevoile ONG-ului
                    tau. Un membru al echipei Code for Romania te va contacta pentru detalii
                    suplimentare in cel mai scurt timp, pe emailul persoanei de contact mentionat in
                    profilul tau de organizatie. Iti multumim!
                  </p>
                  <div>
                    <button className="edit-button pl-8 pr-8 flex gap-4">
                      <XIcon className="h-5 w-5" />
                      Anuleaza solicitare
                    </button>
                  </div>
                </div>
              </div>
            )}
            {applicationResponse?.status === ApplicationPermission.RESTRICTED && (
              <div className="w-full h-full bg-white shadow rounded-lg">
                <div className="py-5 px-10 flex gap-2 items-center">
                  <ExclamationCircleIcon className="w-6 h-6  text-red-500" />
                  <span className="font-titilliumBold text-xl text-gray-800 ">
                    Accesul la aplicatie a fost restrictionat
                  </span>
                </div>
                <div className="w-full border-t border-gray-300" />
                <div className="p-8 flex flex-col gap-4">
                  <p className="break-all">Contacteaza-ne pentru restituirea accesului!</p>
                </div>
              </div>
            )}
          </React.Fragment>
        )}
        <div className="w-full h-full bg-white shadow rounded-lg">
          <div className="py-5 px-10 flex justify-between">
            <span className="font-titilliumBold text-xl text-gray-800">Descriere</span>
          </div>
          <div className="w-full border-t border-gray-300" />
          <div className=" p-8 ">
            <p className="break-all">{applicationResponse?.application?.description}</p>
          </div>
        </div>
        <div className="w-full h-full bg-white shadow rounded-lg">
          <div className="py-5 px-10 flex justify-between">
            <span className="font-titilliumBold text-xl text-gray-800">Video prezentare</span>
          </div>
          <div className="w-full border-t border-gray-300" />
          <div className="p-8">
            <iframe
              className="h-96 w-full"
              src={applicationResponse?.application?.videoLink} // May not work with other videos
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Descriere aplicatie"
            />
          </div>
        </div>
      </div>
      {isConfirmationModalOpen && (
        <ConfirmationModal
          title="Ești sigur că dorești eliminarea aplicatiei?"
          description="Închiderea contului ONG Hub înseamnă că nu vei mai avea acces în aplicațiile puse la dispozitie prin intemediul acestui portal. Lorem ipsum. Dacă dorești să închizi contul definitiv, apasă butonul de mai jos iar echipa noastră te va contacta pentru a finaliza procesul."
          closeBtnLabel="Inapoi"
          confirmBtnLabel="Inchide contul"
          onClose={() => {
            setConfirmaitonModalOpen(false);
          }}
          onConfirm={() => alert('not implemented')}
        />
      )}
    </div>
  );
};

export default ApplicationDetails;
