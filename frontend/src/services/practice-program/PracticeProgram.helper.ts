import { formatISO9075 } from 'date-fns';
import { ISelectData, mapSelectToSkill } from '../../common/helpers/format.helper';
import { PracticeProgramPayload } from './interfaces/practice-program-payload.interface';

export const parsePracticaProgramFormDataToPaylod = (
  data: PracticeProgramPayload | Partial<PracticeProgramPayload>,
) => {
  // parse data
  const {
    location,
    faculties,
    skills,
    isPeriodNotDetermined,
    startDate,
    endDate,
    deadline,
    ...practiceProgramPayload
  } = data;

  // mpa skills payload
  const skillsData = (skills as (ISelectData & { __isNew__: boolean })[])?.map(mapSelectToSkill);

  // format dates
  const formatedStartDate = startDate ? formatISO9075(startDate as Date) : startDate;
  const formatedEndDate = endDate ? formatISO9075(endDate as Date) : endDate;
  const fromatedDeadline = deadline ? formatISO9075(deadline as Date) : deadline;

  return {
    ...practiceProgramPayload,
    isPeriodNotDetermined: !!isPeriodNotDetermined,
    skills: skillsData,
    startDate: formatedStartDate,
    endDate: formatedEndDate,
    deadline: fromatedDeadline,
    faculties: (faculties as { value: number; label: string }[])?.map((faculty) => faculty.value),
    locationId: (location as { value: number; label: string })?.value,
  };
};
