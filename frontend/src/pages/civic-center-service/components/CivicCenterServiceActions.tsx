import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CardActions from '../../../components/card-actions/CardActions';
import { CivicCenterService } from '../../../services/civic-center-service/interfaces/civic-center-service.interface';

interface CivicCenterServiceActionsProps {
  service: CivicCenterService;
  refetch: () => void;
}

const CivicCenterServiceActions = ({ service, refetch }: CivicCenterServiceActionsProps) => {
  const { t } = useTranslation(['civic_center_service']);
  const navigate = useNavigate();

  const onActiveChange = async (isActive: boolean) => {
    console.log('on active change - to be implemented');
  };

  const onConfirmDeleteCivicService = async () => {
    console.log('on delete - to be implemented');
  };

  const onViewCivicCenterService = () => {
    console.log('to be implemented');
  };

  const onEdit = () => {
    navigate(`${service.id}`);
  };

  return (
    <CardActions
      isLoading={false}
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
