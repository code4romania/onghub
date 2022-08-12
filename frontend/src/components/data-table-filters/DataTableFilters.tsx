import React, { useState, useMemo, useEffect } from 'react';
import { AdjustmentsIcon, SearchIcon } from '@heroicons/react/outline';
import debouce from 'lodash.debounce';

interface DataTableFiltersProps {
  children?: React.ReactNode;
  searchValue?: string | null;
  onSearch: (searchWord: string) => void;
  onResetFilters: () => void;
}

const DataTableFilters = ({
  children,
  searchValue,
  onSearch,
  onResetFilters,
}: DataTableFiltersProps) => {
  const [filtersCollapsed, setFiltersCollapsed] = useState<boolean>(false);
  const [searchWord, setSearchWord] = useState<string>('');

  // cleanup any side effects of deounce
  useEffect(() => {
    return () => {
      onDebouncedSearch.cancel();
    };
  }, []);

  // handle reset filters scenario
  useEffect(() => {
    if (searchValue === null) setSearchWord('');
  }, [searchValue]);

  const onDebouncedSearch = useMemo(() => {
    return debouce(onSearch, 300);
  }, []);

  const resetFilters = () => {
    onResetFilters();
    setFiltersCollapsed(false);
  };

  const onSearchValueChange = (value: string) => {
    setSearchWord(value);
    onDebouncedSearch(value);
  };

  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="py-4 px-10 flex justify-between gap-x-6">
        <div className="mt-1 relative rounded-md basis-1/4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchWord}
            onChange={(event) => onSearchValueChange(event.target.value)}
            className="pl-10 block w-full pr-10 border-gray-200 shadow-sm  sm:text-base text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Search"
          />
        </div>
        <div className="basis-3/4 flex items-center justify-end gap-x-4">
          <button
            type="button"
            className="edit-button"
            onClick={setFiltersCollapsed.bind(null, !filtersCollapsed)}
          >
            <AdjustmentsIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {filtersCollapsed ? 'Ascunde filtre' : 'Filtre'}
          </button>
          {filtersCollapsed && (
            <button type="button" className="edit-button" onClick={resetFilters}>
              <AdjustmentsIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              {'Reseteaza filtre'}
            </button>
          )}
        </div>
      </div>
      {filtersCollapsed && <div className="px-10 py-6 border-t border-gray-100">{children}</div>}
    </div>
  );
};

export default DataTableFilters;
