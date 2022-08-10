import React, { useState } from 'react';
import { AdjustmentsIcon, SearchIcon } from '@heroicons/react/outline';

interface DataTableFiltersProps {
  children?: React.ReactNode;
  onSearch?: (searchWord: string) => void;
}

const DataTableFilters = ({ children, onSearch }: DataTableFiltersProps) => {
  const [filtersCollapsed, setFiltersCollapsed] = useState<boolean>(false);

  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="py-4 px-10 flex justify-between gap-x-16">
        <div className="mt-1 relative rounded-md flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
          </div>
          <input
            type="text"
            onChange={(event) => onSearch && onSearch(event.target.value)}
            className="pl-10 block w-full pr-10 border-gray-200 shadow-sm  sm:text-base text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Search"
          />
        </div>
        <div className="flex-3 flex items-center justify-end">
          <button
            type="button"
            className="edit-button"
            onClick={setFiltersCollapsed.bind(null, !filtersCollapsed)}
          >
            <AdjustmentsIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {filtersCollapsed ? 'Reseteaza filtre' : 'Filtre'}
          </button>
        </div>
      </div>
      {filtersCollapsed && <div className="px-10 py-6 border-t border-gray-100">{children}</div>}
    </div>
  );
};

export default DataTableFilters;
