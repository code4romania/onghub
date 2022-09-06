import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import { useAuthContext } from '../../contexts/AuthContext';
import { UserRole } from '../users/enums/UserRole.enum';
import ApplicationList from './components/ApplicationList';

const AppStore = () => {
  const navigate = useNavigate();
  const { role } = useAuthContext();

  const { t } = useTranslation('appstore');

  return (
    <ContentWrapper
      title={t('title')}
      subtitle={t('description')}
      addButton={{
        visible: role === UserRole.SUPER_ADMIN,
        btnLabel: t('add'),
        onBtnClick: () => {
          navigate('new');
        },
      }}
    >
      <ApplicationList />
    </ContentWrapper>
  );
};

export default AppStore;
