import React from 'react';

const mockData = [
  {
    id: 1,
    logo: 'https://images.unsplash.com/photo-1663660374106-87adf01ae522?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    name: 'test',
  },
];

const OrganizationApplicationAccessRequestTable = ({
  organizationId,
}: {
  organizationId: string;
}) => {
  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="py-5 px-10 flex justify-between">
        <span className="font-titilliumBold text-xl text-gray-800">Solicitari de aplicatii</span>
      </div>
      <div className="w-full border-t border-gray-300" />
      <div className="overflow-hidden shadow md:rounded-lg px-10">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-100">
            <tr className="font-titilliumBold text-gray-800 text-sm">
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left sm:pl-6 w-10/12">
                Aplicatie
              </th>
              <th scope="col" className="px-3 py-3.5 pr-10 text-right w-2/12">
                Data solicitarii
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {mockData.map((application) => (
              <tr key={application.id}>
                <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 flex flex-row items-center">
                  <div className="h-10 w-10 mr-3">
                    <img src={application.logo} className="h-full w-full rounded-full" />
                  </div>
                  {application.name}
                </td>
                <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  {application.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrganizationApplicationAccessRequestTable;
