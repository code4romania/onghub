import React from 'react';
import { GlobeIcon } from '@heroicons/react/outline';

const InputFieldHttpAddon = () => {
  return (
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <GlobeIcon className="sm:h-5 sm:w-5 h-4 w-4" aria-hidden="true" />
    </div>
  );
};

export default InputFieldHttpAddon;
