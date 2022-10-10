import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useErrorToast, useSuccessToast } from '../../../../common/hooks/useToast';
import CardPanel from '../../../../components/card-panel/CardPanel';
import ContentWrapper from '../../../../components/content-wrapper/ContentWrapper';
import InputField from '../../../../components/InputField/InputField';
import { Loading } from '../../../../components/loading/Loading';
import { useApplicationsForEditUserQuery } from '../../../../services/application/Application.queries';
import {
  useUpdateUserMutation,
  useSelectedUserQuery,
} from '../../../../services/user/User.queries';
import { UserOngApplicationStatus } from '../../../requests/interfaces/OngApplication.interface';
import ApplicationAccessManagement from '../ApplicationAccessManagement';
import { UserCreateConfig } from '../UserCreate/UserCreateConfig';

const UserEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [access, setAccess] = useState<any>({});

  const {
    isLoading: isLoadingApplications,
    error: applicationsError,
    data: applications,
  } = useApplicationsForEditUserQuery(id as string);

  const updateUserMutation = useUpdateUserMutation();
  const { data: user, error } = useSelectedUserQuery(id as string);
  const { t } = useTranslation(['user', 'common']);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (user) {
      reset(user);
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      useErrorToast(`${t('edit.load_error')} ${id}`);
    }

    if (applicationsError) {
      useErrorToast('Error while loading the applications');
    }
  }, [error, applicationsError]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    const applicationAccess = Object.getOwnPropertyNames(access)
      .filter((applicationId) => access[applicationId])
      .map((applicationId) => ({
        ongApplicationId: applicationId,
        status: UserOngApplicationStatus.ACTIVE,
      }));

    updateUserMutation.mutate(
      { userId: id as string, payload: { ...data, applicationAccess } },
      {
        onSuccess: () => {
          useSuccessToast(t('edit.success'));
        },
        onError: () => {
          useErrorToast(t('edit.failure'));
        },
      },
    );
  };

  return (
    <ContentWrapper
      title={t('edit', { ns: 'common' })}
      subtitle={t('subtitle')}
      backButton={{ btnLabel: t('back', { ns: 'common' }), onBtnClick: () => navigate('/users') }}
    >
      <div className="flex flex-col gap-6">
        <CardPanel
          title={t('edit', { ns: 'common' })}
          loading={updateUserMutation.isLoading}
          onSave={handleSubmit(onSubmit)}
        >
          <form className="xl:w-1/2 flex flex-col gap-y-4 pb-20">
            <div className="flex gap-x-6">
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
                        }}
                      />
                    );
                  }}
                />
              </div>
              <div className="flex-1" />
            </div>
            <div className="flex gap-x-6">
              <Controller
                key={UserCreateConfig.email.key}
                name={UserCreateConfig.email.key}
                rules={UserCreateConfig.email.rules}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <InputField
                      disabled
                      config={{
                        ...UserCreateConfig.email.config,
                        name: UserCreateConfig.email.key,
                        error: errors[UserCreateConfig.email?.key]?.message,
                        defaultValue: value,
                        onChange: onChange,
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

export default UserEdit;
