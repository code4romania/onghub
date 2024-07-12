import React from 'react';
import Spinner from '../spinner/Spinner';

const LoadingContent = () => {
  return (
    <div className="text-center">
      <Spinner className="inline w-8 h-8" />
    </div>
  );
};

export default LoadingContent;
