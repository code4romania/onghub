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
      <div className="flex items-center justify-between">
        <div className="flex ">
          {backButton && (
            <button
              className="back-button flex items-center justify-center"
              type="button"
              onClick={backButton.onBtnClick}
            >
              <ChevronLeftIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
              {backButton.btnLabel || 'Inapoi'}
            </button>
          )}
          <p className="text-gray-800 font-titilliumBold text-3xl">{title}</p>
        </div>
        <div className="flex gap-4">
          {deleteButton && (deleteButton.visible ?? true) && (
            <button
              type="button"
              className="red-button mt-1 mr-1"
              onClick={deleteButton.onBtnClick}
            >
              <TrashIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              {deleteButton.btnLabel}
            </button>
          )}
          {editButton && (editButton.visible ?? true) && (
            <button type="button" className="edit-button mt-1 mr-1" onClick={editButton.onBtnClick}>
              <PencilIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              {editButton.btnLabel}
            </button>
          )}
          {addButton && (addButton.visible ?? true) && (
            <button type="button" className="save-button mt-1 mr-1" onClick={addButton.onBtnClick}>
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              {addButton.btnLabel}
            </button>
          )}
        </div>
      </div>
      {subtitle && <p className="text-gray-400 pt-6">{subtitle}</p>}
      <div className="py-6">{children}</div>
    </section>
  );
};

export default ContentWrapper;
