import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataTableFilters from '../../../../components/data-table-filters/DataTableFilters';
import Select from '../../../../components/Select/Select';
import {
  ApplicationTypeCollection,
  ApplicationTypeEnum,
} from '../../../apps-store/constants/ApplicationType.enum';

const mockData = [
  {
    id: 1,
    logo: 'https://images.unsplash.com/photo-1663660374106-87adf01ae522?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
    name: 'test',
  },
];

const OrganizationApplications = () => {
  const [searchWord, setSearchWord] = useState<string | null>(null);
  const [type, setType] = useState<{ type: ApplicationTypeEnum; label: string } | null>();

  const { t } = useTranslation('appstore');

  const onSearch = (searchWord: string) => {
    setSearchWord(searchWord);
  };

  const onTypeChange = (selected: { type: ApplicationTypeEnum; label: string }) => {
    setType(selected);
  };

  const onResetFilters = () => {
    setSearchWord(null);
  };

  return (
    <div className="w-full h-full flex flex-col gap-5">
      <DataTableFilters
        onSearch={onSearch}
        searchValue={searchWord}
        onResetFilters={onResetFilters}
      >
        <div className="flex gap-x-6">
          <div className="basis-1/4">
            <Select
              config={{
                label: t('list.type'),
                collection: ApplicationTypeCollection,
                displayedAttribute: 'label',
              }}
              selected={type}
              onChange={onTypeChange}
            />
          </div>
        </div>
      </DataTableFilters>
      <div className="w-full bg-white shadow rounded-lg">
        <div className="py-5 px-10 flex justify-between">
          <span className="font-titilliumBold text-xl text-gray-800">Aplicatii in folosinta</span>
        </div>
        <div className="w-full border-t border-gray-300" />
        <div className="overflow-hidden shadow md:rounded-lg px-10">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-100">
              <tr className="font-titilliumBold text-gray-800 text-sm">
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left sm:pl-6 w-6/12">
                  Aplicatie
                </th>
                <th scope="col" className="px-3 py-3.5 pr-10 text-right w-2/12">
                  Data adaugarii
                </th>
                <th scope="col" className="px-3 py-3.5 pr-10 text-right w-2/12">
                  Status access
                </th>
                <th scope="col" className="px-3 py-3.5 pr-10 text-right w-2/12">
                  Ultima accesare
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
                  <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
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
    </div>
  );
};

export default OrganizationApplications;
