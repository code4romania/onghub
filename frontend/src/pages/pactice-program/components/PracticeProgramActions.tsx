import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { classNames } from '../../../common/helpers/tailwind.helper';
import { PracticeProgram } from '../../../services/practice-program/interfaces/practice-program.interface';

interface PracticeProgramActionsProps {
  program: PracticeProgram;
}

interface StatusRadioComponentProps {
  active: boolean;
  setActive: (active: boolean) => void;
}

const StatusRadioComponent = ({ active, setActive }: StatusRadioComponentProps) => {
  const { t } = useTranslation('common');
  return (
    <div className="border border-gray-100 w-full h-10 rounded-md flex flex-row divide-x divide-gray-200">
      <div
        className={classNames(
          !active ? 'bg-gray-900 text-white' : '',
          'flex-1 py-2 cursor-pointer rounded-l-md flex items-center justify-center',
        )}
        onClick={setActive.bind(null, false)}
      >
        {t('inactive')}
      </div>
      <div
        className={classNames(
          active ? 'bg-green-400 text-white' : '',
          'flex-1 py-2 cursor-pointer rounded-r-md flex items-center justify-center',
        )}
        onClick={setActive.bind(null, true)}
      >
        {t('active')}
      </div>
    </div>
  );
};

const PracticeProgramActions = ({ program }: PracticeProgramActionsProps) => {
  const { t } = useTranslation('common');
  const [active, setActive] = useState<boolean>(program.active);

  const onActiveChange = (isActive: boolean) => {
    setActive(isActive);
  };

  return (
    <div className="flex flex-col gap-4 p-4 mt-8 border-t border-gray-100 itens-center md:m-0 md:pl-[25%] md:py-0 md:pr-0 md:items-end md:border-none">
      <StatusRadioComponent active={active} setActive={onActiveChange} />
      <button
        className="edit-button w-full flex gap-4 justify-center disabled:bg-gray-50"
        onClick={() => console.log('view')}
        disabled={!program?.active}
      >
        {t('view')}
      </button>
      <button
        className="edit-button w-full flex gap-4 justify-center"
        onClick={() => console.log('edit')}
      >
        {t('edit')}
      </button>
      <button className="delete-button w-full flex gap-4" onClick={() => console.log('delete')}>
        {t('delete')}
      </button>
    </div>
  );
};

export default PracticeProgramActions;
