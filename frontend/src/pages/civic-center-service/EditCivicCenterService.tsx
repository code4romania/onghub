import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import { CivicCenterServicePayload } from '../../services/civic-center-service/interfaces/civic-center-service-payload.interface';
import CivicCenterForm from './components/CivicCenterForm';
import {
  useEditCivicCenterServiceMutation,
  useGetCivicCenterServiceQuery,
} from '../../services/civic-center-service/CivicCenterService.queries';
import { useErrorToast, useSuccessToast } from '../../common/hooks/useToast';
import { mapToId } from '../../common/helpers/format.helper';

const EditCivicCenterService = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { t } = useTranslation(['civic_center_service', 'common']);
  // check additional validity
  const [isFormValid, setIsFormValid] = useState<boolean>(true);

  const { isLoading: isLoadingCivicCenterService, data: civicCenterService } =
    useGetCivicCenterServiceQuery(id as string);

  const { isLoading, mutateAsync: updateCivicCenterService } = useEditCivicCenterServiceMutation();

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
    if (civicCenterService) {
      const { startDate, endDate, domains, ...formData } = civicCenterService;

      reset({
        ...formData,
        domains: domains.map(mapToId),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : endDate,
      });
    }
  }, [civicCenterService]);

  const onSubmit = async (data: CivicCenterServicePayload) => {
    if (isFormValid) {
      // edit civic center service request
      await updateCivicCenterService(
        {
          id: id as string,
          data,
        },
        {
          onSuccess: () => {
            useSuccessToast(t('feedback.success_update'));
            navigate('/service', { replace: true });
          },
          onError: () => {
            useErrorToast(t('feedback.error_update'));
          },
        },
      );
    }
  };

  return (
    <ContentWrapper
      title={t('edit.title')}
      backButton={{
        btnLabel: t('back', { ns: 'common' }),
        onBtnClick: () => navigate('/service'),
      }}
    >
      <div className="w-full bg-white shadow rounded-lg mt-4">
        <div className="py-5 sm:px-10 px-5 flex justify-between">
          <span className="font-titilliumBold sm:text-lg lg:text-xl text-md text-gray-800 self-center">
            {t('edit.card_title')}
          </span>
          <button
            type="button"
            className="save-button sm:text-sm lg:text-base text-xs"
            disabled={isLoading || isLoadingCivicCenterService}
            onClick={handleSubmit(onSubmit)}
          >
            {isLoading || isLoadingCivicCenterService
              ? t('processing', { ns: 'common' })
              : t('save', { ns: 'common' })}
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

export default EditCivicCenterService;
