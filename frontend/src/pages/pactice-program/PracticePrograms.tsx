import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ContentWrapper from '../../components/content-wrapper/ContentWrapper';
import { Loading } from '../../components/loading/Loading';
import { usePracticePrograms } from '../../services/practice-program/PracticeProgram.queries';
import PracticeProgramActions from './components/PracticeProgramActions';
import PracticeProgramContent from './components/PracticeProgramContent';

const PracticePrograms = () => {
  // translations
  const { t } = useTranslation(['practice_program', 'common']);
  // routing
  const navigate = useNavigate();

  // practice programs query
  const { data: practicePrograms, isLoading, error } = usePracticePrograms();

  const onAddPracticeProgram = () => {
    navigate('add');
  };

  return (
    <ContentWrapper
      title={t('list.title')}
      addButton={{
        btnLabel: t('list.add_button'),
        onBtnClick: onAddPracticeProgram,
        visible: true,
      }}
    >
      {isLoading && <Loading />}
      {!isLoading && (
        <div className="flex flex-col gap-8">
          {practicePrograms &&
            practicePrograms.map((program) => (
              <div
                key={program.id}
                className="w-full h-full bg-white shadow rounded-lg p-10 flex flex-col md:flex-row"
              >
                <div className="md:flex-2 xl:flex-3">
                  <PracticeProgramContent program={program} />
                </div>
                <div className="md:flex-1">
                  <PracticeProgramActions program={program} />
                </div>
              </div>
            ))}
          {!!error && <p>{t('details.list_error')}</p>}
          {!practicePrograms && !error && <p>{t('no_data', { ns: 'common' })}</p>}
        </div>
      )}
    </ContentWrapper>
  );
};

export default PracticePrograms;
