import React from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import { Loading } from '../../components/loading/Loading';
import { useApplicationQuery } from '../../services/application/Application.queries';

const Application = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data: application,
    isLoading,
    refetch: refecthApplication,
  } = useApplicationQuery(id as string);

  if (isLoading) {
    return <Loading />;
  }

  const naivgateBack = () => {
    navigate('/all-apps');
  };

  return (
    <ContentWrapper
      title={application?.name || ''}
      backButton={{
        btnLabel: 'Inapoi',
        onBtnClick: naivgateBack,
      }}
    >
      <Outlet context={[application, refecthApplication]} />
    </ContentWrapper>
  );
};

export default Application;
