import { GlobeAltIcon, PlusIcon } from '@heroicons/react/outline';
import logo from '../../../assets/images/logo.svg';
import React from 'react';
import { useApplication } from '../../../services/application/Application.queries';
import { useParams } from 'react-router-dom';
import { Loading } from '../../../components/loading/Loading';

const ApplicationDetails = () => {
  const params = useParams();
  const { data: application, isLoading } = useApplication(params.id ? params?.id : '');

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex gap-4 mr-1 mb-1 relative">
      <div className="flex flex-col rounded-lg bg-white shadow w-96 p-8 divide-y divide-gray-200 h-full">
        <div className="flex flex-col gap-4 min-h-full">
          <img src={application?.logo || logo} className="h-full w-full pt-10 pb-10" />
          <p className="font-titilliumBold text-black text-xl tracking-wide">{application?.name}</p>
          <div className="flex gap-2 pb-2 items-center">
            <GlobeAltIcon className="h-4 w-4" />
            <p
              className="hover:text-blue-800 hover:cursor-pointer"
              onClick={() => {
                window.location.href = application?.website || '';
              }}
            >
              Vezi website
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-4 pb-4">
          <p>Cum poti folosi aplicatia pentru organizatia ta?</p>
          {application?.steps.map((step: any, index: number) => (
            <div className="flex gap-4 items-center" key={index}>
              <div className="rounded-full border-2 m-0 p-4 flex justify-center items-center w-4 h-4">
                {index + 1}
              </div>
              {step}
            </div>
          ))}
        </div>
        <div className="flex pt-4 gap-4 items-center justify-center">
          <button className="save-button pl-8 pr-8 flex gap-4">
            <PlusIcon className="h-5 w-5" />
            Solicita aplicatia
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full h-full">
        <div className="w-full h-full bg-white shadow rounded-lg">
          <div className="py-5 px-10 flex justify-between">
            <span className="font-titilliumBold text-xl text-gray-800">Descriere</span>
          </div>
          <div className="w-full border-t border-gray-300" />
          <div className=" p-8 ">
            <p className="break-all">{application?.description}</p>
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
              src={application?.videoLink} // May not work with other videos
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Descriere aplicatie"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
