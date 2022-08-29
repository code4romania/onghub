import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useErrorToast, useSuccessToast } from '../../../../common/hooks/useToast';
import CardPanel from '../../../../components/card-panel/CardPanel';
import ContentWrapper from '../../../../components/content-wrapper/ContentWrapper';
import InputField from '../../../../components/InputField/InputField';
import { useCreateUserMutation } from '../../../../services/user/User.queries';
import { useSelectedOrganization } from '../../../../store/selectors';
import { UserCreateConfig } from './UserCreateConfig';

const UserCreate = () => {
  const navigate = useNavigate();
  const { organization } = useSelectedOrganization();
  const createUserMutation = useCreateUserMutation();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    createUserMutation.mutate(
      { ...data, organizationId: organization?.id as number },
      {
        onSuccess: () => {
          useSuccessToast('User successfully created');
          navigate('/users');
        },
        onError: (error: unknown) => {
          console.error(error);
          useErrorToast('Could not create the user');
        },
      },
    );
  };

  return (
    <ContentWrapper
      title="Adauga Utilizator"
      subtitle=" Administrează de aici profilul tău de organizație pentru a putea accesa aplicațiile
    disponibile."
      backButton={{ btnLabel: 'Inapoi', onBtnClick: () => navigate('/users') }}
    >
      <div className="py-6 flex">
        <CardPanel
          title="Trimite invitatie"
          btnLabel="Trimite invitatie"
          loading={createUserMutation.isLoading}
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
      </div>
    </ContentWrapper>
  );
};

export default UserCreate;
