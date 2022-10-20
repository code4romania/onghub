import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { mapSelectToSkill } from '../../common/helpers/format.helper';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import { PracticeProgramPayload } from '../../services/practice-program/interfaces/practice-program-payload.interface';
import { useCreatePracticeProgramMutation } from '../../services/practice-program/PracticeProgram.queries';
import PracticeProgramForm from './components/PracticeProgramForm';

const CreatePracticeProgram = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['practice_program', 'common']);
  // check additional validity
  const [isFormValid, setIsFormValid] = useState<boolean>(true);

  const { isLoading, mutateAsync: createPracticeProgram } = useCreatePracticeProgramMutation();

  // React Hook Form
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<PracticeProgramPayload>({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    reset({});
  }, []);

  const onSubmit = async (data: PracticeProgramPayload) => {
    // submit only if additional perdiod and working hours conditions are met
    if (isFormValid) {
      // parse data
      const { location, faculties, skills, isPeriodNotDetermined, ...practiceProgramPayload } =
        data;

      // mpa skills payload
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const skillsData = (skills as any[]).map(mapSelectToSkill);

      const payload = {
        ...practiceProgramPayload,
        isPeriodNotDetermined: !!isPeriodNotDetermined,
        skills: skillsData,
        faculties: (faculties as any[])?.map((faculty) => faculty.id),
        locationId: (location as any)?.value,
      };

      // create practice program request
      await createPracticeProgram(payload, {
        onSuccess: () => {
          console.log('done');
        },
        onError: (error) => {
          console.log('Nu s-a putut crea programul de preactica', error);
        },
      });
    }
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
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            {isLoading ? t('processing', { ns: 'common' }) : t('save', { ns: 'common' })}
          </button>
        </div>
        <div className="w-full border-t border-gray-300" />
        <PracticeProgramForm
          control={control}
          errors={errors}
          watch={watch}
          onChangeFormValidity={setIsFormValid}
        />
      </div>
    </ContentWrapper>
  );
};

export default CreatePracticeProgram;
