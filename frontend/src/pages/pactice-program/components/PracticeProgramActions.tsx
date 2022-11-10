import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useErrorToast, useSuccessToast } from '../../../common/hooks/useToast';
import ConfirmationModal from '../../../components/confim-removal-modal/ConfirmationModal';
import StatusRadioComponent from '../../../components/status-radio/StatusRadio';
import { PracticeProgram } from '../../../services/practice-program/interfaces/practice-program.interface';
import {
  useDeletePracticeProgramMutation,
  useDisablePracticeProgramMutation,
  useEnablePracticeProgramMutation,
} from '../../../services/practice-program/PracticeProgram.queries';

interface PracticeProgramActionsProps {
  program: PracticeProgram;
  refetch: () => void;
}

const PracticeProgramActions = ({ program, refetch }: PracticeProgramActionsProps) => {
  const { t } = useTranslation(['practice_program', 'common']);
  const navigate = useNavigate();
  const [
    isDeletePracticeProgramConfirmationModalOpen,
    setIsDeletePracticeProgramConfirmationModalOpen,
  ] = useState<boolean>(false);

  const { isLoading: isDeleting, mutateAsync: deletePracticeProgram } =
    useDeletePracticeProgramMutation();

  const { mutateAsync: enablePracticeProgram } = useEnablePracticeProgramMutation();
  const { mutateAsync: disablePracticeProgram } = useDisablePracticeProgramMutation();

  const onActiveChange = async (isActive: boolean) => {
    const apiCallbacks = {
      onSuccess: () => {
        refetch();
      },
      onError: () => {
        useErrorToast(t('feedback.error_update'));
      },
    };

    if (isActive) {
      await enablePracticeProgram(program.id, apiCallbacks);
    } else {
      await disablePracticeProgram(program.id, apiCallbacks);
    }
  };

  const onConfirmDeletePraticeProgram = async () => {
    await deletePracticeProgram(program.id, {
      onSuccess: () => {
        useSuccessToast(t('feedback.success_delete'));
        refetch();
      },
      onError: () => {
        useErrorToast(t('feedback.error_delete'));
      },
      onSettled: () => {
        setIsDeletePracticeProgramConfirmationModalOpen(false);
      },
    });
  };

  const onViewPracticeProgram = () => {
    console.log('to be implemented');
  };

  const onEdit = () => {
    navigate(`${program.id}`);
  };

  return (
    <div className="flex flex-col gap-4 p-4 mt-8 border-t border-gray-100 itens-center md:m-0 md:pl-[25%] md:py-0 md:pr-0 md:items-end md:border-none">
      <StatusRadioComponent active={program.active} setActive={onActiveChange} />
      <button
        className="edit-button w-full flex gap-4 justify-center disabled:bg-gray-50"
        onClick={onViewPracticeProgram}
        disabled={!program?.active}
      >
        {t('view', { ns: 'common' })}
      </button>
      <button className="edit-button w-full flex gap-4 justify-center" onClick={onEdit}>
        {t('edit', { ns: 'common' })}
      </button>
      <button
        className="delete-button w-full flex gap-4 disabled:bg-gray-100"
        onClick={setIsDeletePracticeProgramConfirmationModalOpen.bind(null, true)}
        disabled={isDeleting}
      >
        {!isDeleting ? t('delete', { ns: 'common' }) : t('loading', { ns: 'common' })}
      </button>
      {isDeletePracticeProgramConfirmationModalOpen && (
        <ConfirmationModal
          title={t('details.delete_modal.title')}
          description={t('details.delete_modal.description')}
          closeBtnLabel={t('back', { ns: 'common' })}
          confirmBtnLabel={t('delete', { ns: 'common' })}
          confirmButtonStyle="red-button"
          onClose={setIsDeletePracticeProgramConfirmationModalOpen.bind(null, false)}
          onConfirm={onConfirmDeletePraticeProgram}
        />
      )}
    </div>
  );
};

export default PracticeProgramActions;
