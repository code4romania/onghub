import React from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import { Loading } from '../../components/loading/Loading';
import { useApplicationQuery } from '../../services/application/Application.queries';
import { useErrorToast } from '../../common/hooks/useToast';

const Application = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation(['app', 'common']);

  const {
    data: application,
    isLoading,
    error,
    refetch: refetchApplication,
  } = useApplicationQuery(id as string);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    navigate('/applications');
    useErrorToast(t('wrong', { ns: 'common' }));
    return null;
  }

  const navigateBack = () => {
    navigate(-1);
  };

  return (
    <ContentWrapper
      title={application?.name || t('title')}
      backButton={{
        btnLabel: t('back', { ns: 'common' }),
        onBtnClick: navigateBack,
      }}
    >
      <Outlet context={[application, refetchApplication]} />
    </ContentWrapper>
  );
};

export default Application;
