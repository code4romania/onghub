import React, { useEffect, useState } from 'react';
import NameWithLogo from '../../../components/name-with-logo/NameWithLogo';
import Toggle from '../../../components/toggle/Toggle';
import { ApplicationAccess } from '../../../services/application/interfaces/Application.interface';
import { UserOngApplicationStatus } from '../../requests/interfaces/OngApplication.interface';

interface ApplicationAccessManagementProps {
  applications: ApplicationAccess[];
  onAccessChange: (access: any) => void;
}

interface ApplicationToggleProps {
  applicationId: number;
  initialStatus: boolean;
  onApplicationStatusChange: (applicationId: number, enabled: boolean) => void;
}

const ApplicationToggle = ({
  applicationId,
  initialStatus,
  onApplicationStatusChange,
}: ApplicationToggleProps) => {
  const [enabled, setEnabled] = useState<boolean>(initialStatus);

  useEffect(() => {
    onApplicationStatusChange(applicationId, enabled);
  }, [enabled]);

  return <Toggle enabled={enabled} setEnabled={setEnabled} />;
};

const ApplicationAccessManagement = ({
  applications,
  onAccessChange,
}: ApplicationAccessManagementProps) => {
  const [accessTree, setAccessTree] = useState<any>({});

  useEffect(() => {
    let newAccess = {};
    applications.forEach((application) => {
      newAccess = {
        ...newAccess,
        [application.id]: application.status === UserOngApplicationStatus.ACTIVE,
      };
    });

    setAccessTree(newAccess);
  }, [applications]);

  useEffect(() => {
    onAccessChange(accessTree);
  }, [accessTree]);

  const enableAccess = (applicationId: number, enabled: boolean) => {
    setAccessTree({
      ...accessTree,
      [applicationId]: enabled,
    });
  };

  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="py-5 px-10 flex justify-between">
        <span className="font-titilliumBold sm:text-lg lg:text-xl text-md text-gray-800">
          Access
        </span>
        <div className="flex items-center justify-between">
          {/* <span className="font-robotoBold text-gray-800 text-base font-bold mr-4">
            Access ONGHub
          </span>
          <Toggle enabled={enabled} setEnabled={setEnabled} /> */}
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
                <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 flex flex-row items-center">
                  <NameWithLogo logo={application.logo} name={application.name} />
                </td>
                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  <ApplicationToggle
                    initialStatus={application.status === UserOngApplicationStatus.ACTIVE}
                    applicationId={application.id}
                    onApplicationStatusChange={enableAccess}
                  />
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
