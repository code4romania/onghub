import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import CivicCenterForm from './components/CivicCenterForm';

const CreateCivicCenterService = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['civic_center_service', 'common']);
  // check additional validity
  const [isFormValid, setIsFormValid] = useState<boolean>(true);

  const isLoading = false;

  // React Hook Form
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<any>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    reset({});
  }, []);

  const onSubmit = async (data: any) => {
    if (isFormValid) {
      // create practice program request
      console.log('data', data);
    }
  };

  return (
    <ContentWrapper
      title={t('add.title')}
      backButton={{
        btnLabel: t('back', { ns: 'common' }),
        onBtnClick: () => navigate('/service'),
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
