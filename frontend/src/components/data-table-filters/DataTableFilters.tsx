import React, { useState, useMemo, useEffect } from 'react';
import { AdjustmentsVerticalIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import debouce from 'lodash.debounce';
import { useTranslation } from 'react-i18next';

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

  const { t } = useTranslation('common');

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
    return debouce(onSearch, 800);
  }, []);

  const resetFilters = () => {
    onResetFilters();
    setFiltersCollapsed(true);
  };

  const onSearchValueChange = (value: string) => {
    setSearchWord(value);
    onDebouncedSearch(value);
  };

  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="py-4 lg:px-10 px-4 flex gap-x-6 gap-y-4 flex-wrap">
        <div className="mt-1 relative rounded-md sm:w-auto w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-300" aria-hidden="true" />
          </div>
          <input
            type="text"
            value={searchWord}
            onChange={(event) => onSearchValueChange(event.target.value)}
            className="pl-10 block w-full sm:pr-10 pr-2 border-gray-200 shadow-sm sm:text-sm lg:text-base text-xs rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Search"
          />
        </div>
        <div className="flex items-center gap-x-4 sm:ml-auto ml-0">
          <button
            aria-label={filtersCollapsed ? t('filters.hide') : t('filters.show')}
            type="button"
            className="edit-button sm:text-sm lg:text-base text-xs"
            onClick={setFiltersCollapsed.bind(null, !filtersCollapsed)}
          >
            <AdjustmentsVerticalIcon className="-ml-1 mr-2 sm:h-5 sm:w-5 h-4 w-4" aria-hidden="true" />
            {filtersCollapsed ? t('filters.hide') : t('filters.show')}
          </button>
          {filtersCollapsed && (
            <button
              aria-label={t('filters.reset')}
              type="button"
              className="edit-button bg-gray-50 sm:text-sm lg:text-base text-xs"
              onClick={resetFilters}
            >
              <AdjustmentsVerticalIcon className="-ml-1 mr-2 sm:h-5 sm:w-5 h-4 w-4" aria-hidden="true" />
              {t('filters.reset')}
            </button>
          )}
        </div>
      </div>
      {filtersCollapsed && (
        <div className="lg:px-10 px-5 py-6 border-t border-gray-100">{children}</div>
      )}
    </div>
  );
};

export default DataTableFilters;
