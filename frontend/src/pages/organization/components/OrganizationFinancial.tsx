import { PencilIcon } from '@heroicons/react/outline';
import React, { useState } from 'react';
import { classNames } from '../../../common/helpers/tailwind.helper';

const OrganizationFinancial = () => {
  const [isEditMode, setEditMode] = useState(false);

  const handleSave = () => {
    setEditMode((mode) => !mode);
  };

  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="p-5 sm:p-10 flex justify-between">
        <span className="font-titilliumBold text-xl text-gray-800">Date Financiare</span>

        <button
          type="button"
          className={classNames(isEditMode ? 'save-button' : 'edit-button')}
          onClick={handleSave}
        >
          <PencilIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          {isEditMode ? 'Salveaza' : 'Editeaza'}
        </button>
      </div>

      <div className="w-full border-t border-gray-300" />
      <div className="p-5 sm:p-10">Continut</div>
    </div>
  );
};

export default OrganizationFinancial;
