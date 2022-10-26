import React from 'react';
import { LocationMarkerIcon } from '@heroicons/react/solid';
import { useTranslation } from 'react-i18next';
import { formatDate, formatDateMonthYear } from '../../../common/helpers/format.helper';
import { PracticeProgram } from '../../../services/practice-program/interfaces/practice-program.interface';
import ShowMoreText from 'react-show-more-text';

interface PracticeProgramContentProps {
  program: PracticeProgram;
}

interface PracticeProgramContentItemProps {
  label: string;
  value: string;
}

const PracticeProgramContentItem = ({ label, value }: PracticeProgramContentItemProps) => {
  return (
    <div className="flex flex-col sm:flex-row w-full">
      <div className="flex-1 font-titilliumSemiBold text-base">{label}</div>
      <div className="flex-1 text-base">{value || 'N/A'}</div>
    </div>
  );
};

const PracticeProgramContentExpandableItemItem = ({
  label,
  value,
}: PracticeProgramContentItemProps) => {
  const { t } = useTranslation('common');
  return (
    <div className="flex flex-col sm:flex-row w-full">
      <div className="flex-1 font-titilliumSemiBold text-base">{label}</div>
      <div className="flex-1 text-base">
        <ShowMoreText
          /* Default options */
          lines={2}
          more={t('show_more')}
          less={t('show_less')}
          anchorClass="show-more-text"
          expanded={false}
          width={0}
        >
          {value}
        </ShowMoreText>
      </div>
    </div>
  );
};

const PracticeProgramContent = ({ program }: PracticeProgramContentProps) => {
  const { t } = useTranslation('practice_program');

  const calculatePerid = () => {
    if (!program?.endDate) {
      const startDate = formatDateMonthYear(program?.startDate);
      return `${t('details.period_starting_with')} ${startDate}`;
    } else {
      const endDate = program?.endDate
        ? formatDateMonthYear(program.endDate)
        : t('details.deadline_unlimited');
      const startDate = formatDateMonthYear(program?.startDate);
      return `${startDate} - ${endDate}`;
    }
  };

  const formatDomains = () => {
    return program?.domains.map((domain) => domain.name).join(', ');
  };

  const formatFaculties = () => {
    return program?.faculties.map((faculty) => faculty.name).join(', ');
  };

  const formatSkills = () => {
    return program?.skills.map((skill) => skill.name).join(', ');
  };

  return (
    <section className="divide-y divide-gray-100">
      <div className="flex flex-col gap-2">
        <h3 className="font-titilliumBold text-2xl">{program.title}</h3>
        <p className="flex font-titilliumSemiBold text-base items-center gap-1 pb-11">
          <LocationMarkerIcon className="h-4 w-4" />
          <span>{program.location.name}</span>
        </p>
      </div>
      <div className="flex flex-col py-8 lg:flex-row">
        <div className="flex-1 flex flex-col gap-4 pb-4">
          <PracticeProgramContentItem
            label={t('details.deadline')}
            value={program?.endDate ? formatDate(program.endDate) : t('details.deadline_unlimited')}
          />
          <PracticeProgramContentItem label={t('details.period')} value={calculatePerid()} />
          <PracticeProgramContentItem
            label={t('details.working_hours')}
            value={`${program?.minWorkingHours} - ${program?.maxWorkingHours}`}
          />
          <PracticeProgramContentExpandableItemItem
            label={t('details.faculties')}
            value={formatFaculties()}
          />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <PracticeProgramContentItem label={t('details.domains')} value={formatDomains()} />
          <PracticeProgramContentItem label={t('details.skills')} value={formatSkills()} />
        </div>
      </div>
      <div className="pt-8">
        <p>{program?.description}</p>
      </div>
    </section>
  );
};

export default PracticeProgramContent;
