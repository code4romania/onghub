import React from 'react';
import { useNavigate } from 'react-router-dom';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import { useAuthContext } from '../../contexts/AuthContext';
import { UserRole } from '../users/enums/UserRole.enum';
import ApplicationList from './components/ApplicationList';

const AppStore = () => {
  const navigate = useNavigate();
  const { role } = useAuthContext();

  return (
    <ContentWrapper
      title="Aplicatii"
      subtitle="Lorem ipsum. Administrează de aici profilul tău de organizație pentru a putea accesa aplicațiile disponibile."
      addButton={{
        visible: role === UserRole.SUPER_ADMIN,
        btnLabel: 'Adauga aplicatie',
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
