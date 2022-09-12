import React from 'react';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import ApplicationListCards from '../apps-store/components/ApplicationListCards';

const MyApps = () => {
  return (
    <ContentWrapper
      title="Aplicatiile mele"
      subtitle="Lorem ipsum. Administrează de aici profilul tău de organizație pentru a putea accesa aplicațiile disponibile."
    >
      <ApplicationListCards isOngView={true} />
    </ContentWrapper>
  );
};

export default MyApps;
