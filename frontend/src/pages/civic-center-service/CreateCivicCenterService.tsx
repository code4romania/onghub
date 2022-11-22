import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import { CivicCenterServicePayload } from '../../services/civic-center-service/interfaces/civic-center-service-payload.interface';
import CivicCenterForm from './components/CivicCenterForm';
import { useCreateCivicCenterServiceMutation } from '../../services/civic-center-service/CivicCenterService.queries';
import { useErrorToast, useSuccessToast } from '../../common/hooks/useToast';
import { setUrlPrefix } from '../../common/helpers/format.helper';

const CreateCivicCenterService = () => {
  const navigate = useNavigate();

  const { organizationId } = useParams();

  const { t } = useTranslation(['civic_center_service', 'common']);
  // check additional validity
  const [isFormValid, setIsFormValid] = useState<boolean>(true);

  const { isLoading, mutateAsync: createCivicCenterService } =
    useCreateCivicCenterServiceMutation();

  // React Hook Form
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<CivicCenterServicePayload>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    reset({});
  }, []);

  const onSubmit = async (data: CivicCenterServicePayload) => {
    if (isFormValid) {
      // create civic center service request
      await createCivicCenterService(
        {
          ...data,
          organizationId: organizationId,
          onlineAccessLink: setUrlPrefix(data.onlineAccessLink) || undefined,
        },
        {
          onSuccess: () => {
            useSuccessToast(t('feedback.success_create'));

            if (organizationId) {
              navigate(`/organizations/${organizationId}/services`, { replace: true });
            } else {
              navigate('/service', { replace: true });
            }
          },
          onError: () => {
            useErrorToast(t('feedback.error_create'));
          },
        },
      );
    }
  };

  return (
    <ContentWrapper
      title={t('add.title')}
      backButton={{
        btnLabel: t('back', { ns: 'common' }),
        onBtnClick: () =>
          organizationId
            ? navigate(`/organizations/${organizationId}/services`)
            : navigate('/service'),
      }}
    >
      <div className="w-full bg-white shadow rounded-lg mt-4">
        <div className="py-5 sm:px-10 px-5 flex justify-between">
          <span className="font-titilliumBold sm:text-lg lg:text-xl text-md text-gray-800 self-center">
            {t('add.card_title')}
          </span>
          <button
            type="button"
            className="save-button sm:text-sm lg:text-base text-xs"
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            {isLoading ? t('processing', { ns: 'common' }) : t('save', { ns: 'common' })}
          </button>
        </div>
        <div className="w-full border-t border-gray-300" />
        <CivicCenterForm
          control={control}
          errors={errors}
          watch={watch}
          onChangeFormValidity={setIsFormValid}
        />
      </div>
    </ContentWrapper>
  );
};

export default CreateCivicCenterService;
