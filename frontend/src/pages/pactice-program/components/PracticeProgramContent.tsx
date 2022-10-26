import { LocationMarkerIcon } from '@heroicons/react/solid';
import React from 'react';
import { PracticeProgram } from '../../../services/practice-program/interfaces/practice-program.interface';

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
      <div className="flex-1 text-base">{value}</div>
    </div>
  );
};

const PracticeProgramContent = ({ program }: PracticeProgramContentProps) => {
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
        <div className="flex-1">
          <PracticeProgramContentItem label={'Deadline aplicare'} value={'nelimitat'} />
        </div>
        <div className="flex-1"></div>
      </div>
      <div></div>
    </section>
  );
};

export default PracticeProgramContent;
