import React from 'react';

interface StatisticsErrorBanner {
  message: string;
}

const StatisticsErrorBanner = ({ message }: StatisticsErrorBanner) => {
  return (
    <div className="mx-auto py-2">
      <div className="rounded-lg bg-red-400 p-2 shadow-lg sm:p-3 max-w-6xl">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex w-0 flex-1 items-center">
            <p className="ml-3 truncate font-medium text-white">
              <span className="hidden md:inline">{message}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsErrorBanner;
