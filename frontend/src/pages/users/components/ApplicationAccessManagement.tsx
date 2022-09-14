import React, { useState } from 'react';
import Toggle from '../../../components/toggle/Toggle';

const ApplicationAccessManagement = () => {
  const [enabled, setEnabled] = useState(false);

  const applications = [
    {
      id: 1,
      name: 'Redirectioneaza',
    },
    {
      id: 2,
      name: 'Teo',
    },
  ];

  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="py-5 px-10 flex justify-between">
        <span className="font-titilliumBold text-xl text-gray-800">Access</span>
        <div className="flex items-center justify-between">
          <span className="font-robotoBold text-gray-800 text-base font-bold mr-4">
            Access ONGHub
          </span>
          <Toggle enabled={enabled} setEnabled={setEnabled} />
        </div>
      </div>
      <div className="w-full border-t border-gray-300" />
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-100">
            <tr className="font-titilliumBold text-gray-800 text-sm">
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left sm:pl-6 w-11/12">
                Aplicatie
              </th>
              <th scope="col" className="px-3 py-3.5 pr-10 text-right w-1/12">
                Access
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {applications.map((application) => (
              <tr key={application.id}>
                <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {application.name}
                </td>
                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  <Toggle enabled={enabled} setEnabled={setEnabled} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationAccessManagement;
