import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { openInNewTab } from '../../../common/helpers/format.helper';
import { useErrorToast, useSuccessToast } from '../../../common/hooks/useToast';
import CardActions from '../../../components/card-actions/CardActions';
import {
  useDeleteCCServiceMutation,
  useDisableCCServiceMutation,
  useEnableCCServiceMutation,
} from '../../../services/civic-center-service/CivicCenterService.queries';
import { CivicCenterService } from '../../../services/civic-center-service/interfaces/civic-center-service.interface';

interface CivicCenterServiceActionsProps {
  service: CivicCenterService;
  refetch: () => void;
}

const CivicCenterServiceActions = ({ service, refetch }: CivicCenterServiceActionsProps) => {
  const { t } = useTranslation(['civic_center_service']);
  const navigate = useNavigate();

  const { isLoading: isDeleting, mutateAsync: deleteService } = useDeleteCCServiceMutation();

  const { mutateAsync: enableService } = useEnableCCServiceMutation();
  const { mutateAsync: disableService } = useDisableCCServiceMutation();

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
      await enableService(service.id, apiCallbacks);
    } else {
      await disableService(service.id, apiCallbacks);
    }
  };

  const onConfirmDeleteCivicService = async () => {
    await deleteService(service.id, {
      onSuccess: () => {
        useSuccessToast(t('feedback.success_delete'));
        refetch();
      },
      onError: () => {
        useErrorToast(t('feedback.error_delete'));
      },
    });
  };

  const onViewCivicCenterService = () => {
    openInNewTab(`${process.env.REACT_APP_CIVIC_CENTER_WEBSITE}/services/${service.id}`);
  };

  const onEdit = () => {
    navigate(`${service.id}`);
  };

  return (
    <CardActions
      isLoading={isDeleting}
      active={service.active}
      deleteModalTitle={t('details.delete_modal.title')}
      deleteModalDescription={t('details.delete_modal.description')}
      onActiveChange={onActiveChange}
      onDelete={onConfirmDeleteCivicService}
      onEdit={onEdit}
      onGoToView={onViewCivicCenterService}
    />
  );
};

export default CivicCenterServiceActions;
