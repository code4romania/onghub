import React from 'react';
import { useNavigate } from 'react-router-dom';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import { useAuthContext } from '../../contexts/AuthContext';
import { UserRole } from '../users/enums/UserRole.enum';

const AppStore = () => {
  const navigate = useNavigate();
  const { role } = useAuthContext();

  return (
    <ContentWrapper
      title="Aplicatii"
      subtitle="Lorem ipsum. Administrează de aici profilul tău de organizație pentru a putea accesa aplicațiile disponibile."
      btnLabel={role === UserRole.SUPER_ADMIN ? 'Adauga aplicatie' : null}
      onBtnClick={() => {
        navigate('new');
      }}
    ></ContentWrapper>
  );
};

export default AppStore;
