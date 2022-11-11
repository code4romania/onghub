import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfirmationModal from '../confim-removal-modal/ConfirmationModal';
import StatusRadioComponent from '../status-radio/StatusRadio';

interface CardActionsProps {
  active: boolean;
  isLoading?: boolean;
  deleteModalTitle: string;
  deleteModalDescription: string;
  onDelete: () => void;
  onEdit: () => void;
  onActiveChange: (active: boolean) => void;
  onGoToView: () => void;
}

const CardActions = ({
  active,
  isLoading,
  deleteModalTitle,
  deleteModalDescription,
  onDelete,
  onEdit,
  onActiveChange,
  onGoToView,
}: CardActionsProps) => {
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState<boolean>(false);

  const { t } = useTranslation(['common']);

  const onConfimDelete = () => {
    onDelete();
    setIsDeleteConfirmationModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 p-4 mt-8 border-t border-gray-100 itens-center md:m-0 md:pl-[25%] md:py-0 md:pr-0 md:items-end md:border-none">
      <StatusRadioComponent active={active} setActive={onActiveChange} />
      <button
        className="edit-button w-full flex gap-4 justify-center disabled:bg-gray-50"
        onClick={onGoToView}
        disabled={!active}
      >
        {t('view', { ns: 'common' })}
      </button>
      <button className="edit-button w-full flex gap-4 justify-center" onClick={onEdit}>
        {t('edit', { ns: 'common' })}
      </button>
      <button
        className="delete-button w-full flex gap-4 disabled:bg-gray-100"
        onClick={setIsDeleteConfirmationModalOpen.bind(null, true)}
        disabled={isLoading}
      >
        {!isLoading ? t('delete', { ns: 'common' }) : t('loading', { ns: 'common' })}
      </button>
      {isDeleteConfirmationModalOpen && (
        <ConfirmationModal
          title={deleteModalTitle}
          description={deleteModalDescription}
          closeBtnLabel={t('back', { ns: 'common' })}
          confirmBtnLabel={t('delete', { ns: 'common' })}
          confirmButtonStyle="red-button"
          onClose={setIsDeleteConfirmationModalOpen.bind(null, false)}
          onConfirm={onConfimDelete}
        />
      )}
    </div>
  );
};

export default CardActions;
