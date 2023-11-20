import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { openInNewTab } from '../../../common/helpers/format.helper';
import { useErrorToast, useSuccessToast } from '../../../common/hooks/useToast';
import CardActions from '../../../components/card-actions/CardActions';
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
    });
  };

  const onViewPracticeProgram = () => {
    openInNewTab(`${process.env.REACT_APP_P4G_WEBSITE}/practice-programs/${program.id}`);
  };

  const onEdit = () => {
    navigate(`${program.id}`);
  };

  return (
    <CardActions
      isLoading={isDeleting}
      active={program.active}
      deleteModalTitle={t('details.delete_modal.title')}
      deleteModalDescription={t('details.delete_modal.description')}
      onActiveChange={onActiveChange}
      onDelete={onConfirmDeletePraticeProgram}
      onEdit={onEdit}
      onGoToView={onViewPracticeProgram}
    />
  );
};

export default PracticeProgramActions;
