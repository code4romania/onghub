import React from 'react';
import { useNavigate } from 'react-router-dom';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import { useAuthContext } from '../../contexts/AuthContext';
import { UserRole } from '../users/enums/UserRole.enum';
import ApplicationListAdmin from './components/ApplicationListAdmin';
import ApplicationListSuperAdmin from './components/ApplicationListSuperAdmin';

const AppStore = () => {
  const navigate = useNavigate();
  const { role } = useAuthContext();

  return (
    <ContentWrapper
      title="Toate aplicatiile"
      subtitle="Lorem ipsum. Administrează de aici profilul tău de organizație pentru a putea accesa aplicațiile disponibile."
      addButton={{
        visible: role === UserRole.SUPER_ADMIN,
        btnLabel: 'Adauga aplicatie',
        onBtnClick: () => {
          navigate('new');
        },
      }}
    >
      {role === UserRole.ADMIN ? <ApplicationListSuperAdmin /> : <ApplicationListAdmin />}
    </ContentWrapper>
  );
};

export default AppStore;
