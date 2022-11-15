import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import ContentWrapper from '../../../../components/content-wrapper/ContentWrapper';
import CivicCenterServiceList from '../../../civic-center-service/CivicCenterServiceList';

const OrganizationServices = () => {
  const { id } = useParams();

  const { t } = useTranslation('civic_center_service');
  // routing
  const navigate = useNavigate();

  const onAddService = () => {
    navigate(`/organizations/${id}/services/add`);
  };

  return (
    <ContentWrapper
      title=""
      addButton={{
        btnLabel: t('wrapper.add_button'),
        onBtnClick: onAddService,
        visible: true,
      }}
    >
      <CivicCenterServiceList />
    </ContentWrapper>
  );
};

export default OrganizationServices;
