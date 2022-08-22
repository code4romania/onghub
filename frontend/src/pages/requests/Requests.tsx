import React from 'react';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import RequestList from './components/RequestList';

const Requests = () => {
  return (
    <ContentWrapper
      title="Solicitari access"
      subtitle="Lorem ipsum. Administrează de aici profilul tău de organizație pentru a putea accesa aplicațiile disponibile. "
    >
      <div className="pb-6 flex mt-4 w-full">
        <RequestList />
      </div>
    </ContentWrapper>
  );
};

export default Requests;
