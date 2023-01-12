import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useErrorToast, useSuccessToast } from '../../../../common/hooks/useToast';
import CardPanel from '../../../../components/card-panel/CardPanel';
import ContentWrapper from '../../../../components/content-wrapper/ContentWrapper';
import InputField from '../../../../components/InputField/InputField';
import { Loading } from '../../../../components/loading/Loading';
import { userApplicationsForCreateUser } from '../../../../services/application/Application.queries';
import { useCreateUserMutation } from '../../../../services/user/User.queries';
import { useSelectedOrganization } from '../../../../store/selectors';
import { UserOngApplicationStatus } from '../../../requests/interfaces/OngApplication.interface';
import { CREATE_USER_ERRORS } from '../../constants/error.constants';
import ApplicationAccessManagement from '../ApplicationAccessManagement';
import { UserCreateConfig } from './UserCreateConfig';

const UserCreate = () => {
  const navigate = useNavigate();
  const { organization } = useSelectedOrganization();
  const [access, setAccess] = useState<any>({});

  // requst applications
  const {
    data: applications,
    isLoading: isLoadingApplications,
    error: ongApplicationsError,
  } = userApplicationsForCreateUser();

  // user create
  const createUserMutation = useCreateUserMutation();
  const { t } = useTranslation(['user', 'common']);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (ongApplicationsError) {
      useErrorToast(`Could not load applications`);
    }
  }, [ongApplicationsError]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    const applicationAccess = Object.getOwnPropertyNames(access)
      .filter((applicationId) => access[applicationId])
      .map((applicationId) => ({
        ongApplicationId: applicationId,
        status: UserOngApplicationStatus.ACTIVE,
      }));

    createUserMutation.mutate(
      { ...data, organizationId: organization?.id as number, applicationAccess },
      {
        onSuccess: () => {
          useSuccessToast(t('create.success'));
          navigate('/users/list');
        },
        onError: (error) => {
          const createError: any = error;
          const err = createError?.response?.data;
          if (err.code) {
            useErrorToast(CREATE_USER_ERRORS[err.code]);
          } else {
            useErrorToast(t('create.failure'));
          }
        },
      },
    );
  };

  return (
    <ContentWrapper
      title={t('add')}
      subtitle={t('subtitle')}
      backButton={{
        btnLabel: t('back', { ns: 'common' }),
        onBtnClick: () => navigate('/users/list'),
      }}
    >
      <div className="flex flex-col gap-6">
        <CardPanel
          title={t('create.invite')}
          btnLabel={t('create.invite')}
          loading={createUserMutation.isLoading}
          onSave={handleSubmit(onSubmit)}
        >
          <form className="xl:w-1/2 flex flex-col gap-y-4">
            <div className="flex gap-x-6 sm:flex-row flex-col">
              <div className="flex-1">
                <Controller
                  key={UserCreateConfig.name.key}
                  name={UserCreateConfig.name.key}
                  rules={UserCreateConfig.name.rules}
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <InputField
                        config={{
                          ...UserCreateConfig.name.config,
                          name: UserCreateConfig.name.key,
                          error: errors[UserCreateConfig.name?.key]?.message,
                          defaultValue: value,
                          onChange: onChange,
                          id: 'user-create__name',
                        }}
                      />
                    );
                  }}
                />
              </div>
              <div className="flex-1" />
            </div>
            <div className="flex gap-x-6 gap-y-4 sm:flex-row flex-col">
              <Controller
                key={UserCreateConfig.email.key}
                name={UserCreateConfig.email.key}
                rules={UserCreateConfig.email.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <InputField
                      config={{
                        ...UserCreateConfig.email.config,
                        name: UserCreateConfig.email.key,
                        error: errors[UserCreateConfig.email?.key]?.message,
                        defaultValue: value,
                        onChange: onChange,
                        id: 'user-create__email',
                      }}
                    />
                  );
                }}
              />
              <Controller
                key={UserCreateConfig.phone.key}
                name={UserCreateConfig.phone.key}
                rules={UserCreateConfig.phone.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <InputField
                      config={{
                        ...UserCreateConfig.phone.config,
                        name: UserCreateConfig.phone.key,
                        error: errors[UserCreateConfig.phone?.key]?.message,
                        defaultValue: value,
                        onChange: onChange,
                        id: 'user-create__phone',
                      }}
                    />
                  );
                }}
              />
            </div>
          </form>
        </CardPanel>
        {isLoadingApplications ? (
          <Loading />
        ) : (
          <>
            {applications && applications.length > 0 && (
              <ApplicationAccessManagement
                applications={applications || []}
                onAccessChange={setAccess}
              />
            )}
          </>
        )}
      </div>
    </ContentWrapper>
  );
};

export default UserCreate;
