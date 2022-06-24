import React, { useState } from 'react';
import { ExclamationCircleIcon, PencilIcon } from '@heroicons/react/solid';
import { classNames } from '../../../common/helpers/tailwind.helper';

const OrganizationGeneral = () => {
  const [isEditMode, setEditMode] = useState(false);

  const handleSave = () => {
    setEditMode((mode) => !mode);
  };

  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="p-5 sm:p-10 flex justify-between">
        <span className="font-titilliumBold text-xl text-gray-800">Date generale</span>

        <button
          type="button"
          className={classNames(isEditMode ? 'save-button' : 'edit-button')}
          onClick={handleSave}
        >
          <PencilIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          {isEditMode ? 'Salveaza modificari' : 'Editeaza'}
        </button>
      </div>

      <div className="w-full border-t border-gray-300" />
      <div className="p-5 sm:p-10">
        <div className="flex flex-col gap-y-4">
          <span className="font-bold text-gray-800">General</span>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="email"
                name="email"
                id="email"
                className="block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                placeholder=""
                defaultValue=""
                aria-invalid="false"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500" id="email-description">
              We will only use this for spam.
            </p>
            <p className="mt-2 text-sm text-red-600" id="email-error">
              Your password must be less than 4 characters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationGeneral;
