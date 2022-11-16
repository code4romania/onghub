import React from 'react';
import { useTranslation } from 'react-i18next';
import ContentWrapper from '../../../components/content-wrapper/ContentWrapper';
import { Loading } from '../../../components/loading/Loading';
import { PracticeProgram } from '../../../services/practice-program/interfaces/practice-program.interface';
import PracticeProgramActions from './PracticeProgramActions';
import PracticeProgramContent from './PracticeProgramContent';

interface PracticeProgramsListProps {
  isLoading?: boolean;
  error?: unknown;
  practicePrograms?: PracticeProgram[];
  hideTitle?: boolean;
  refetch: () => void;
  onAddPracticeProgram: () => void;
}

const PracticeProgramsList = ({
  practicePrograms,
  isLoading,
  error,
  hideTitle,
  refetch,
  onAddPracticeProgram,
}: PracticeProgramsListProps) => {
  // translations
  const { t } = useTranslation(['practice_program', 'common']);

  return (
    <ContentWrapper
      title={!hideTitle ? t('list.title') : ''}
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
                  <PracticeProgramActions program={program} refetch={refetch} />
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

export default PracticeProgramsList;
