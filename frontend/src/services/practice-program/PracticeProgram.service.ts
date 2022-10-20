import { AxiosResponse } from 'axios';
import API from '../API';
import { PracticeProgramPayload } from './interfaces/practice-program-payload.interface';
import { PracticeProgram } from './interfaces/practice-program.interface';

export const createPracticeProgram = (
  practiceProgramPayloa: PracticeProgramPayload,
): Promise<PracticeProgram> => {
  return API.post(`/practice-program`, practiceProgramPayloa).then(
    (res: AxiosResponse<PracticeProgram>) => res.data,
  );
};
