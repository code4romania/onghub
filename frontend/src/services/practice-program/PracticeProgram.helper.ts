import { formatISO9075 } from 'date-fns';
import { mapSelectToSkill } from '../../common/helpers/format.helper';
import { PracticeProgramPayload } from './interfaces/practice-program-payload.interface';

export const parsePracticaProgramFormDataToPaylod = (data: PracticeProgramPayload) => {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const skillsData = (skills as any[])?.map(mapSelectToSkill);

  // format dates
  const formatedStartDate = formatISO9075(startDate as Date);
  const formatedEndDate = endDate ? formatISO9075(startDate as Date) : endDate;
  const fromatedDeadline = deadline ? formatISO9075(deadline as Date) : deadline;

  return {
    ...practiceProgramPayload,
    isPeriodNotDetermined: !!isPeriodNotDetermined,
    skills: skillsData,
    startDate: formatedStartDate,
    endDate: formatedEndDate,
    deadline: fromatedDeadline,
    faculties: faculties?.map((faculty: any) => faculty.value),
    locationId: (location as any)?.value,
  };
};
