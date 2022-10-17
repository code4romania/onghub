import { ChevronLeftIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/outline';
import React from 'react';

interface ContentWrapperProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  backButton?: ContentWrapperButton;
  editButton?: ContentWrapperButton;
  addButton?: ContentWrapperButton;
  deleteButton?: ContentWrapperButton;
}

interface ContentWrapperButton {
  btnLabel: string;
  onBtnClick: () => void;
  visible?: boolean;
}

const ContentWrapper = ({
  title,
  subtitle,
  children,
  backButton,
  editButton,
  addButton,
  deleteButton,
}: ContentWrapperProps) => {
  return (
    <section>
      <div className="flex justify-between items-start gap-y-3">
        <div className="flex sm:flex-row flex-col gap-y-4">
          {backButton && (
            <button
              className="back-button flex items-center justify-center sm:text-sm lg:text-base text-xs max-w-fit max-h-10"
              type="button"
              onClick={backButton.onBtnClick}
            >
              <ChevronLeftIcon className="-ml-1 mr-2 sm:h-5 sm:w-5 h-4 w-4" aria-hidden="true" />
              {backButton.btnLabel || 'Inapoi'}
            </button>
          )}
          <p className="text-gray-800 font-titilliumBold sm:text-2xl lg:text-3xl text-lg self-center">
            {title}
          </p>
        </div>
        <div className="flex gap-4 ml-auto">
          {deleteButton && (deleteButton.visible ?? true) && (
            <button
              type="button"
              className="red-button mt-1 mr-1 sm:text-sm lg:text-base text-xs max-h-10"
              onClick={deleteButton.onBtnClick}
            >
              <TrashIcon className="-ml-1 mr-2 sm:h-5 sm:w-5 h-4 w-4" aria-hidden="true" />
              {deleteButton.btnLabel}
            </button>
          )}
          {editButton && (editButton.visible ?? true) && (
            <button
              type="button"
              className="edit-button sm:text-sm lg:text-base text-xs max-h-10"
              onClick={editButton.onBtnClick}
            >
              <PencilIcon className="-ml-1 mr-2 sm:h-5 sm:w-5 h-4 w-4" aria-hidden="true" />
              {editButton.btnLabel}
            </button>
          )}
          {addButton && (addButton.visible ?? true) && (
            <button
              type="button"
              className="save-button mt-1 mr-1 sm:text-sm lg:text-base text-xs max-h-10"
              onClick={addButton.onBtnClick}
            >
              <PlusIcon className="-ml-1 mr-2 sm:h-5 sm:w-5 h-4 w-4" aria-hidden="true" />
              {addButton.btnLabel}
            </button>
          )}
        </div>
      </div>
      {subtitle && (
        <p className="text-gray-400 lg:pt-6 pt-3 sm:text-sm lg:text-base text-xs">{subtitle}</p>
      )}
      <div className="py-6">{children}</div>
    </section>
  );
};

export default ContentWrapper;
