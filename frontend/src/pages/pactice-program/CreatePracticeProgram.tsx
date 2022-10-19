import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import PracticeProgramForm from './components/PracticeProgramForm';

const CreatePracticeProgram = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['practice_program', 'common']);
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
    // TODO: validate startDate > endDate
    console.log('data', data);
  };

  return (
    <ContentWrapper
      title={t('add.title', { ns: 'practice_program' })}
      backButton={{
        btnLabel: t('back', { ns: 'common' }),
        onBtnClick: () => navigate('/practice-program'),
      }}
    >
      <div className="w-full bg-white shadow rounded-lg mt-4">
        <div className="py-5 sm:px-10 px-5 flex justify-between">
          <span className="font-titilliumBold sm:text-lg lg:text-xl text-md text-gray-800 self-center">
            {t('add.card_title', { ns: 'practice_program' })}
          </span>
          <button
            type="button"
            className="save-button sm:text-sm lg:text-base text-xs"
            onClick={handleSubmit(onSubmit)}
          >
            {t('save', { ns: 'common' })}
          </button>
        </div>
        <div className="w-full border-t border-gray-300" />
        <PracticeProgramForm control={control} errors={errors} watch={watch} />
      </div>
    </ContentWrapper>
  );
};

export default CreatePracticeProgram;
