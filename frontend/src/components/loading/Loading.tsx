import React from 'react';
import LoadingContent from '../data-table/LoadingContent';

export const Loading = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
      <LoadingContent /> <span>Se incarca...</span>
    </div>
  );
};
